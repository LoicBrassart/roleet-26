# Architecture frontend

> Méthodologie : **Feature-Sliced Design (FSD)** — https://feature-sliced.design
> Voir aussi : [data-model.md](./data-model.md)

> **Statut :** le code actuel contient un blog servant d'exercice et le recueil de scénarios de la v1 ; voir [Itération actuelle](#itération-actuelle) et [Arborescence cible](#arborescence-cible-v1).

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
`shared/mock.ts` contient des données métier, ce qui fait exception au principe de `shared`. L'exception est assumée : le mock disparaîtra quand le backend arrivera. Seules les fonctions d'accès des entités le lisent, et elles sont `async` pour que le passage à `fetch` ne change pas leur signature.

### D3 — Tags et avertissements sont des entités indépendantes des scénarios
`entities/tag` et `entities/content-warning` existent à côté de `entities/scenario`, sans que l'une importe l'autre. Un scénario ne connaît que des `id`, qui sont de simples nombres. C'est la **page** qui récupère les données et les assemble, donc `@x` n'est pas nécessaire : son loader résout les `id`, et elle passe les badges aux composants de l'entité par un slot (la prop `badges`).

### D4 — Tags et avertissements partagent un composant visuel, pas leurs données
`Badge`, avec une variante pour les avertissements, et `BadgeList` vivent dans `shared/ui` et ne connaissent ni l'un ni l'autre : `BadgeList` n'attend que des objets `{ id, label }`.

### D5 — Le descellement est une feature
« Desceller » est une action utilisateur, donc une slice `features/unseal-scenario`. Le statut scellé / descellé ne fait pas partie du modèle `Scenario` (voir [data-model.md](./data-model.md)).

La liste des descellements est stockée dans le `localStorage` pour le moment, en anticipant qu'un backend le remplacera. La lecture et l'écriture vivent toutes les deux dans le segment `api` de cette slice, avec des fonctions `async`, pour que ce remplacement ne change pas leur signature. Les pages lisent le statut via l'API publique de la feature.

`UnsealButton` est un `<Form method="post">` de React Router. Il déclenche l'`action` de la page, qui appelle `unsealScenario`, puis React Router relance les loaders : l'affichage se met à jour sans état local. L'entité ne connaît pas la feature : la page lui passe soit le contenu scellé, soit le bouton, par le slot `sealedContent`.

Dans la liste, le statut passe par un slot dédié de `ScenarioCard`, `sealStatus`, que la page remplit avec `SealStatus`. Ce n'est pas un badge, car un badge décrit le contenu, alors que le statut décrit la relation de l'utilisateur au scénario.

### D6 — Styles : Shadcn avec Tailwind pour l'instant, puis CSS Modules
Shadcn est adopté pour ses composants (style, accessibilité, facilité d'utilisation), avec Tailwind en attendant de réécrire sa couche de style en CSS Modules, composant par composant.

- **`app/styles/` :**
  - `index.css` : le point d'entrée importé par `main.tsx`. Il contient l'import de Tailwind et le bloc `@theme inline`, qui disparaîtront avec Tailwind.
  - `theme.css` : les variables du thème (`--background`, `--primary`, `--radius`, etc.), en CSS standard, qui survivront à Tailwind.
- **Reset :** Preflight, celui de Tailwind, dont les composants Shadcn dépendent. Pas de second reset tant que Tailwind est là. Si un reset coexiste un jour avec Tailwind, il doit être importé dans la couche `base` (`@import ... layer(base)`), sinon il écrase les classes Tailwind.
- **Cascade :** Preflight est dans la couche `base`. Les sélecteurs d'éléments globaux (`h1`, `a`, `button`) vont aussi dans `@layer base`, sinon ils écraseraient les classes Tailwind des composants Shadcn. Les CSS Modules, hors couche, l'emportent sur Preflight.
- **Composants Shadcn :** style `base-nova`, bâti sur Base UI (`@base-ui/react`). Ils vont dans `shared/ui/shadcn/`, avec les noms de fichiers en minuscules générés par la CLI. C'est la seule exception à la convention de nommage. Ils sont exportés par `shared/ui/index.ts`, comme les autres : les consommateurs ignorent leur origine.
- **`components.json` :** l'alias `ui` pointe vers `@/shared/ui/shadcn`, et `utils` vers `@/shared/lib/utils`. L'alias `@/` est aussi déclaré dans le `tsconfig.json` racine, que lit la CLI.
- **`cn` :** la CLI utilise le paquet npm `cn` (publié par Shadcn, il remplace `clsx` + `tailwind-merge`). `shared/lib/utils.ts` le réexporte. Il fusionne des classes Tailwind : les composants maison n'en ont pas besoin, `clsx` leur suffit.
- **ESLint :** `react-refresh/only-export-components` est désactivée pour `src/shared/ui/shadcn/**` seulement, car les fichiers générés exportent aussi des constantes (`buttonVariants`, etc.).
- **Tailwind reste confiné à `shared/ui/shadcn/`.** Le reste du code utilise des CSS Modules et les variables de `theme.css`.
- **Markdown :** Preflight retire les styles par défaut des éléments générés par `react-markdown`. Ils sont restylés par `shared/ui/Markdown.module.css`, qui cible les descendants de l'enveloppe avec `:global(h2)`, etc. Le plugin `@tailwindcss/typography` a été écarté, car `prose` aurait mis du Tailwind hors de `shadcn/`.
- **Migration, plus tard :** pour chaque composant, une version en `.tsx` et `.module.css` avec la même API (`cva` reste utilisable), puis la correction des composants de `shadcn/` qui l'importaient, la mise à jour de `index.ts` et la suppression du fichier généré. Quand `shadcn/` est vide, on retire Tailwind et on ajoute un reset moderne.

---

## Itération actuelle

Le blog est un exercice d'apprentissage, avec une seule entité : `article`. Il est conservé à côté des scénarios. L'affichage détaillé des articles et les messages d'erreur ne sont pas une priorité.

```
src/
├── app/                      # main, router, App (layout), RootErrorBoundary
├── pages/
│   ├── article-list/
│   ├── article-detail/
│   ├── scenario-list/
│   └── scenario-detail/      # loader et action
├── features/
│   └── unseal-scenario/
├── entities/
│   ├── article/
│   ├── scenario/
│   ├── tag/
│   └── content-warning/
└── shared/
    ├── ui/                   # Badge, BadgeList, Markdown
    └── mock.ts               # bouchon temporaire (D2)
```

### Routes

```
/  (App + boundary de secours)
└── sans path (boundary principale)
    ├── index      → redirection vers /scenario
    ├── blog
    │   ├── index  → liste
    │   └── :id    → détail
    ├── scenario
    │   ├── index  → liste
    │   └── :id    → détail, avec l'action de descellement
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
    ├── ui/                   # UI kit, dont Badge (D4) et l'enveloppe de react-markdown
    │   └── shadcn/           # composants générés, remplacés au fur et à mesure (D6)
    ├── lib/                  # cn (D6)
    └── mock.ts               # bouchon temporaire (D2)
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

- **`Badge` :** garder le composant maison ou adopter celui de Shadcn. La décision sera prise après le setup (D6).
