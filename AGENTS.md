# AGENTS.md

Contexte de reprise pour tout agent IA intervenant sur ce dépôt.

## Rôle attendu

- **Mode mentor.** Le but du projet est l'apprentissage de React-TS et de l'architecture FSD (Feature-Sliced Design).
- **Ne jamais écrire de code applicatif** sauf demande **expresse** de l'utilisateur. Expliquer, donner des pistes, des noms d'API à chercher dans la doc, des étapes, des questions à se poser. Une petite arborescence de dossiers reste acceptable.
- **Ne jamais commiter de code source.** Seuls les fichiers de documentation peuvent l'être. L'utilisateur fait ses commits lui-même.
- **Converser en français.**
- Pour une relecture, lire réellement les fichiers et lancer les vérifications (voir plus bas) avant de répondre. Présenter le résultat sous la forme ✅ fait / ⚠️ à revoir / ❌ pas fait, suivi d'un step by step.

## Projet

- Frontend seul pour l'instant, dans `frontend/` : Vite, React 19, TypeScript 6, React Router (mode « data », `createBrowserRouter`), Steiger (linter FSD). Un backend est prévu à terme.
- Premier objectif : un blog simple avec **une seule entité, `article`**. Ce blog est **avant tout un exercice**, avant le domaine JDR décrit dans `docs/`.
- Documentation de l'utilisateur : `readme.md`, `docs/architecture.md`, `docs/data-model.md`.

### Vérifications (depuis `frontend/`)

```
npm run check
```

Cette commande enchaîne ESLint (`lint`), Steiger (`lint:fsd`) et le build, qui inclut `tsc -b`.

## Décisions prises

- **Données :** un mock JSON, `src/shared/mock.json`, importé directement. C'est un **bouchon temporaire assumé** dans `shared` (voir D7 dans `docs/architecture.md`). Les fonctions d'accès sont `async` pour pouvoir passer plus tard à un `fetch` sans changer leur signature.
- **Priorités de l'exercice :** l'affichage précis des articles est reporté, et les messages de `RootErrorBoundary` conviennent en l'état. Ne pas les signaler comme des manques en relecture.
- **Modèle `Article` :** `id: number`, `title`, `content`, `author`, `publishedAt: string`. La date reste une chaîne ISO pour l'instant. Les DTO (type brut dans `api/` avec une conversion vers le type métier dans `model/`) sont reportés à plus tard.
- **Routing :** les données sont chargées par des loaders React Router, lus avec `useLoaderData<typeof xxxLoader>()`. Les composants ne sont jamais `async`.
- **Conventions de nommage :**
  - Les exports de l'entité ont des noms explicites (`getAllArticles`, `getArticleById`, `ArticleCard`, `ArticleDetail`), sans alias.
  - Chaque page a son loader dans `pages/<slice>/api/loader.ts`, exporté sous le nom `<slice en camelCase>Loader` (`articleListLoader`, `articleDetailLoader`).
  - Les fichiers de types s'appellent `model/types.ts`, et les composants `ui/NomDuComposant.tsx`.
  - Les composants utilisent des exports nommés, pas d'export par défaut.
- **Règles FSD appliquées :**
  - Une couche importe uniquement depuis les couches **strictement inférieures**, quelle que soit la distance.
  - Il n'y a pas d'import entre slices d'une même couche.
  - Une API publique (`index.ts`) existe **par slice**, jamais au niveau d'une couche.
  - L'extérieur d'une slice passe toujours par son `index.ts`. À l'intérieur, on utilise des imports relatifs directs (`../model/types`) et jamais `..`, pour éviter les dépendances circulaires.
  - L'entité ne connaît pas le routeur : c'est la page qui adapte `params` en arguments métier.
  - Le routeur, dans `app/`, n'importe que des pages, en dehors de `app/` lui-même.
  - `app/` n'a pas de segment `ui` (règle Steiger `no-ui-in-app`) : ses composants sont à sa racine.
  - On utilise `import type` quand seul le type est nécessaire (`verbatimModuleSyntax` est activé).

## État actuel (au 2026-11-01)

Dernier commit : `Write a new article about react-router and Layout`. Le routeur, le layout et la gestion des erreurs sont terminés.

```
frontend/src/
├── app/            main.tsx, router.tsx, App.tsx (layout), RootErrorBoundary.tsx
├── pages/
│   ├── article-list/    api/loader.ts, ui/ArticleListPage.tsx, index.ts
│   └── article-detail/  api/loader.ts, ui/ArticleDetailPage.tsx, index.ts
├── entities/article/    api/access.ts, model/types.ts, ui/ArticleCard.tsx, ui/ArticleDetail.tsx, index.ts
└── shared/mock.json
```

- L'arbre de routes et le rôle des deux boundaries sont décrits dans `docs/architecture.md`, section « Itération actuelle ».
- Les 404 passent par `throw data(..., { status: 404 })`. La route `*` en lance une pour les URL inconnues.

## Mission en cours : les liens de la liste vers le détail

Ajouter des `<Link>` de `ArticleListPage` vers `ArticleDetailPage`. `ArticleCard` (l'entité) ne doit pas dépendre du routage de l'application.

Piste recommandée à l'utilisateur (non commencée au moment de la rédaction, et pas encore validée par lui) : la **page** construit l'URL et enveloppe `ArticleCard` dans un `<Link>`. L'entité ne change pas.

## Points ouverts

- boundary spécifique « article introuvable » dans `pages/article-detail/ui/` ;
- DTO et conversion des dates ;
- fuseau horaire des dates du mock ;
- affichage de `content` et `publishedAt` dans `ArticleDetail` (reporté par l'utilisateur) ;
- alias d'import (`@/`) ;
- route modules `lazy` ;
- deuxième entité, avec les références croisées entre entités (`@x`).
