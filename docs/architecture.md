# Architecture frontend

> Méthodologie : **Feature-Sliced Design (FSD)** — https://feature-sliced.design
> Voir aussi : [data-model.md](./data-model.md)

> **Statut :** ce document décrit la **cible** (le domaine JDR). Le code actuel est un blog servant d'exercice ; voir [Itération actuelle](#itération-actuelle--le-blog).

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
2. **Pas d'import entre slices d'une même couche**, sauf via la notation `@x` (voir plus bas).
3. **API publique** : chaque slice expose un `index.ts` ; on n'importe jamais un fichier interne d'une autre slice.
4. `app` et `shared` n'ont pas de slices, seulement des segments. `app` n'a pas de segment `ui` (règle Steiger `no-ui-in-app`).

### Segments

`ui` (composants) · `model` (types, état, logique) · `api` (appels backend) · `lib` (utilitaires internes à la slice) · `config` (constantes).

---

## Décisions

### D1 — `shared` ne contient aucune règle métier
`shared` = outils techniques du site (UI kit, client HTTP, utilitaires génériques). Les règles de jeu n'y ont pas leur place.

### D2 — Une entité par système de jeu
Chaque système supporté est une slice de `entities` (ex. `entities/dnd5e-2024`). Elle contient **tout** ce qui est propre au système :
- `model` : type de la feuille (`sheet`), configuration des règles, **tous** les calculs (fonctions pures) ;
- `ui` : composants d'affichage « bêtes » (bloc de carac, ligne de compétence…).

**Critère de rangement** : une fonction qui n'a besoin que des données du bloc `sheet` appartient au **système**, pas au personnage.

### D3 — `entities/character` reste agnostique du système
Contient `meta`, `lore`, et un `sheet` typé comme **union discriminée** des feuilles des systèmes supportés (discriminant : `sheet.system`). Aucune règle de jeu n'y vit.

### D4 — Sens de dépendance entre entités : `character → système`, jamais l'inverse
`character` a besoin du type de feuille du système : il l'importe via l'API croisée `@x` exposée par le système (`entities/dnd5e-2024/@x/character`). Un système ne connaît jamais `character`.

### D5 — L'aiguillage entre systèmes se fait au niveau `widgets`
Le widget `character-sheet` affiche le lore (via `character`), lit `sheet.system`, et délègue l'affichage de la feuille au système correspondant. C'est le seul endroit qui **aiguille l'affichage** selon le système. `entities/character` connaît aussi la liste des systèmes, mais uniquement au niveau des types, à travers l'union de D3.

### D6 — Le `model` d'un système est indépendant de React
Aucun import React / navigateur dans `entities/<système>/model`. Objectif : pouvoir l'extraire plus tard en paquet partagé front/back (moteur de règles) par simple déplacement.

### D7 — Le mock de `shared` est un bouchon temporaire
`shared/mock.json` contient des articles, donc des données métier, ce qui fait exception au principe de `shared`. L'exception est assumée : le mock disparaîtra quand le backend arrivera. Seules les fonctions d'accès de l'entité le lisent, et elles sont `async` pour que le passage à `fetch` ne change pas leur signature.

---

## Itération actuelle : le blog

Exercice d'apprentissage, avec une seule entité : `article`. L'affichage détaillé des articles et les messages d'erreur ne sont pas une priorité.

```
src/
├── app/                      # main, router, App (layout), RootErrorBoundary
├── pages/
│   ├── article-list/
│   └── article-detail/
├── entities/
│   └── article/
└── shared/
    └── mock.json             # bouchon temporaire (D7)
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

## Arborescence cible (v0.1)

Cible indicative : on ne crée une couche / slice que lorsqu'on en a besoin.

```
src/
├── app/                      # providers, routeur, styles globaux
├── pages/
│   ├── character-list/
│   ├── character-detail/
│   └── character-create/
├── widgets/
│   └── character-sheet/      # assemble character + système + features (D5)
├── features/
│   ├── create-character/
│   ├── edit-character/
│   └── delete-character/
├── entities/
│   ├── character/            # meta + lore + sheet (union) — agnostique (D3)
│   │   ├── model/
│   │   ├── api/
│   │   ├── ui/
│   │   └── index.ts
│   └── dnd5e-2024/           # tout ce qui est propre à D&D 5e 2024 (D2)
│       ├── model/            # sans React (D6)
│       ├── ui/
│       ├── @x/
│       │   └── character.ts  # API croisée pour entities/character (D4)
│       └── index.ts
└── shared/
    ├── ui/                   # UI kit
    ├── api/                  # client HTTP / bouchons
    └── lib/
```

## Graphe de dépendances (v0.1)

```
pages ──► widgets/character-sheet ──► features/* ──► entities/character ──@x──► entities/dnd5e-2024
                    │                                                              ▲
                    └──────────────────────────────────────────────────────────────┘
tout ──► shared
```

---

## Outillage

- **Steiger** (linter officiel FSD) vérifie automatiquement les règles d'import : `npm run lint:fsd`, inclus dans `npm run check`
- Prévu : alias d'import `@/` → `src/`

## Questions ouvertes

- **Features d'édition spécifiques à un système** : l'édition des caracs / compétences 5e est-elle une feature générique `edit-character` qui délègue au système, ou des features dédiées par système ? À trancher au moment d'implémenter l'édition.
- **Extraction du moteur de règles** en paquet partagé front/back (cf. D6) : plus tard.
