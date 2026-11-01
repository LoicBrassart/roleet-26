# Architecture frontend

> Méthodologie : **Feature-Sliced Design (FSD)** — https://feature-sliced.design
> Voir aussi : [data-model.md](./data-model.md)

> **Statut :** le code actuel est un blog servant d'exercice ; voir [Itération actuelle](#itération-actuelle--le-blog). La cible y ajoute un recueil de scénarios, et le blog est conservé ; voir [Arborescence cible](#arborescence-cible-v1).

## Rappel FSD

### Couches (du plus haut au plus bas)

| Couche | Rôle |
|---|---|
| `app` | Initialisation : providers, routeur, styles globaux |
| `pages` | Une page complète par route |
| `widgets` | Gros blocs d'UI autonomes, composant entités + features |
| `features` | Une **action utilisateur** porteuse de valeur (un verbe) |
| `entities` | Les **objets métier** (un nom) |
| `shared` | Réutilisable **sans aucune connaissance métier** |

### Règles

1. **Import vers le bas uniquement** : une couche n'importe que des couches strictement inférieures.
2. **Pas d'import entre slices d'une même couche**, sauf via la notation `@x` (non utilisée pour l'instant).
3. **API publique** : chaque slice expose un `index.ts` ; on n'importe jamais un fichier interne d'une autre slice.
4. `app` et `shared` n'ont pas de slices, seulement des segments. `app` n'a pas de segment `ui` (règle Steiger `no-ui-in-app`).

### Segments

`ui` (composants) · `model` (types, état, logique) · `api` (appels backend) · `lib` (utilitaires internes à la slice) · `config` (constantes).

---

## Décisions

### D1 — `shared` ne contient aucune règle métier
`shared` = outils techniques du site (UI kit, client HTTP, utilitaires génériques). Les règles métier n'y ont pas leur place.

### D2 — Le mock de `shared` est un bouchon temporaire
`shared/mock.json` contient des données métier, ce qui fait exception au principe de `shared`. L'exception est assumée : le mock disparaîtra quand le backend arrivera. Seules les fonctions d'accès des entités le lisent, et elles sont `async` pour que le passage à `fetch` ne change pas leur signature.

### D3 — Tags et avertissements sont des entités indépendantes des scénarios
`entities/tag` et `entities/content-warning` existent à côté de `entities/scenario`, sans que l'une importe l'autre. Un scénario ne connaît que des `id`, qui sont de simples chaînes. C'est la **page** qui récupère les données et les assemble, donc `@x` n'est pas nécessaire.

### D4 — Tags et avertissements partagent un composant visuel, pas leurs données
Le composant d'affichage (ex. `Badge`, avec une variante pour les avertissements) vit dans `shared/ui` et ne connaît ni l'un ni l'autre.

### D5 — Le descellement est une feature
« Desceller » est une action utilisateur, donc une slice `features/unseal-scenario`. Le statut scellé / descellé ne fait pas partie du modèle `Scenario` (voir [data-model.md](./data-model.md)).

La liste des descellements est stockée dans le `localStorage` pour le moment, en anticipant qu'un backend le remplacera. La lecture et l'écriture vivent toutes les deux dans le segment `api` de cette slice, avec des fonctions `async`, pour que ce remplacement ne change pas leur signature. Les pages lisent le statut via l'API publique de la feature.

---

## Itération actuelle : le blog

Exercice d'apprentissage, avec une seule entité : `article`. Le blog est conservé quand les scénarios s'y ajoutent. L'affichage détaillé des articles et les messages d'erreur ne sont pas une priorité.

```
src/
├── app/                      # main, router, App (layout), RootErrorBoundary
├── pages/
│   ├── article-list/
│   └── article-detail/
├── entities/
│   └── article/
└── shared/
    └── mock.json             # bouchon temporaire (D2)
```

### Routes

```
/  (App + boundary de secours)
└── sans path (boundary principale)
    ├── index      → redirection vers /blog
    ├── blog
    │   ├── index  → liste
    │   └── :id    → détail
    └── *          → loader qui lance une 404
```

- **Boundary principale :** placée sous le layout, elle attrape les erreurs des pages et garde le header à l'écran.
- **Boundary de secours :** placée sur le layout, elle ne sert que si `App` plante, et s'affiche donc sans header.
- **Route `*` :** sans elle, une URL inconnue ne correspondrait à aucun enfant et remonterait au layout, sans passer par la boundary principale.
- **Loader d'une route parente :** il s'exécute pour tous ses enfants. Une redirection n'y a donc pas sa place, sous peine de boucle infinie : elle va sur la route `index`.

---

## Arborescence cible (v1)

Cible indicative : on ne crée une couche / slice que lorsqu'on en a besoin.

```
src/
├── app/                      # main, router, App (layout), RootErrorBoundary
├── pages/
│   ├── article-list/
│   ├── article-detail/
│   ├── scenario-list/
│   └── scenario-detail/
├── features/
│   └── unseal-scenario/      # action de descellement (D5)
├── entities/
│   ├── article/
│   ├── scenario/
│   │   ├── model/
│   │   ├── api/
│   │   ├── ui/
│   │   └── index.ts
│   ├── tag/                  # D3
│   └── content-warning/      # D3
└── shared/
    ├── ui/                   # UI kit, dont Badge (D4)
    └── mock.json             # bouchon temporaire (D2)
```

## Graphe de dépendances (v1)

```
pages ──► features/unseal-scenario
  │
  ├─────► entities/article
  ├─────► entities/scenario
  ├─────► entities/tag
  └─────► entities/content-warning

tout ──► shared
```

---

## Outillage

- **Steiger** (linter officiel FSD) vérifie automatiquement les règles d'import : `npm run lint:fsd`, inclus dans `npm run check`
- **Alias d'import** `@/` → `src/` : pour sortir d'une slice. À l'intérieur d'une slice, les imports restent relatifs.

## Questions ouvertes

- **Shadcn** (prévu à terme) : configurer `components.json` pour générer dans `shared/ui` et `shared/lib` avant d'ajouter le premier composant, et déclarer aussi l'alias dans `tsconfig.json`.
