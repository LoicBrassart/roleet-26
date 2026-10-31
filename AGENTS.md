# AGENTS.md

Contexte de reprise pour tout agent IA intervenant sur ce dépôt.

## Rôle attendu

- **Mode mentor.** Le but du projet est l'apprentissage de React-TS et de l'architecture FSD (Feature-Sliced Design).
- **Ne jamais écrire de code applicatif** sauf demande **expresse** de l'utilisateur. Expliquer, donner des pistes, des noms d'API à chercher dans la doc, des étapes, des questions à se poser. Une petite arborescence de dossiers reste acceptable.
- **Ne jamais commiter de code source.** Seuls les fichiers de documentation peuvent l'être. L'utilisateur fait ses commits lui-même.
- **Converser en français.**
- Pour une relecture, lire réellement les fichiers et lancer les vérifications (voir plus bas) avant de répondre. Présenter le résultat sous la forme ✅ fait / ⚠️ à revoir / ❌ pas fait, suivi d'un step by step.

## Projet

- Frontend seul, dans `frontend/` : Vite, React 19, TypeScript 6, React Router (mode « data », `createBrowserRouter`), Steiger (linter FSD).
- Premier objectif : un blog simple avec **une seule entité, `article`**.
- Documentation de l'utilisateur : `readme.md`, `docs/architecture.md`, `docs/data-model.md`.

### Vérifications (depuis `frontend/`)

```
npx tsc -b --noEmit
npx steiger ./src
npx eslint .
npm run build
```

## Décisions prises

- **Données :** un mock JSON, `src/shared/mock.json`, importé directement. Les fonctions d'accès sont `async` pour pouvoir passer plus tard à un `fetch` sans changer leur signature.
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
  - Le routeur, dans `app/`, n'importe que des pages.
  - On utilise `import type` quand seul le type est nécessaire (`verbatimModuleSyntax` est activé).

## État actuel (au 2026-10-29)

Derniers commits : `Create base structure`, `Two first pages`.

```
frontend/src/
├── app/            main.tsx, router.tsx, App.tsx (placeholder « Layout ? », importé nulle part)
├── pages/
│   ├── article-list/    api/loader.ts, ui/ArticleListPage.tsx, index.ts
│   └── article-detail/  api/loader.ts, ui/ArticleDetailPage.tsx, index.ts
├── entities/article/    api/access.ts, model/types.ts, ui/ArticleCard.tsx, ui/ArticleDetail.tsx, index.ts
└── shared/mock.json
```

- Le routeur a des routes **à plat** : `/` redirige vers `/blog` via `loader: () => redirect("/blog")`, `/blog` affiche la liste et `/blog/:id` affiche le détail.
- `tsc`, Steiger, ESLint et le build sont tous au vert.

## Mission en cours : la gestion des erreurs

Référence : <https://reactrouter.com/how-to/error-boundary#data-mode>

Étapes communiquées à l'utilisateur (non commencées au moment de la rédaction) :

1. Dans `articleDetailLoader`, remplacer les deux `throw new Error(...)` par `throw data(..., { status: 404 })`.
2. Créer une error boundary racine **générique** dans `app/`. C'est un composant sans props qui utilise `useRouteError()` et distingue trois branches : `isRouteErrorResponse`, `instanceof Error`, et le cas inconnu.
3. Créer une **route parente** `path: "/"` avec `ErrorBoundary` (la propriété composant, préférée à `errorElement` par cohérence avec `Component`), et y déplacer les routes en `children`. L'ancienne route `/` devient `index: true` et les chemins deviennent relatifs (`blog`, `blog/:id`).
4. Tester `/blog/999`, `/blog/abc`, une URL inconnue, et un `throw` temporaire dans un composant.

Pour plus tard : une boundary spécifique « article introuvable » dans `pages/article-detail/ui/`.

## Missions suivantes

1. Ajouter des `<Link>` de la liste vers le détail. La question à faire trancher : qui construit l'URL ? `ArticleCard` (l'entité) ne doit pas dépendre du routage de l'application, donc l'information de lien doit venir de la page.
2. Faire de `App` le **layout** de la route parente (header, `<Outlet />`).
3. Points ouverts mentionnés en passant :
   - DTO et conversion des dates ;
   - fuseau horaire des dates du mock ;
   - affichage de `content` et `publishedAt` dans `ArticleDetail` ;
   - alias d'import (`@/`) ;
   - route modules `lazy` ;
   - deuxième entité, avec les références croisées entre entités (`@x`).
