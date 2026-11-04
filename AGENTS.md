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
- Le blog, avec son entité `article`, est **avant tout un exercice**.
- **Objectif de la v1 :** ajouter, à côté du blog qui est conservé, un recueil de scénarios originaux à l'usage des meneurs, scellés par défaut, avec un descellement définitif. On reste « frontend first » : pas d'auth ni de vrai suivi. Le modèle et le périmètre sont dans `docs/data-model.md`, la structure cible dans `docs/architecture.md`.
- Documentation de l'utilisateur : `readme.md`, `docs/architecture.md`, `docs/data-model.md`.

### Vérifications (depuis `frontend/`)

```
npm run check
```

Cette commande enchaîne ESLint (`lint`), Steiger (`lint:fsd`) et le build, qui inclut `tsc -b`.

## Décisions prises

- **Données :** un mock TypeScript, `src/shared/mock.ts`, importé directement (les backticks y permettent le Markdown multiligne). C'est un **bouchon temporaire assumé** dans `shared` (voir D2 dans `docs/architecture.md`). Les fonctions d'accès sont `async` pour pouvoir passer plus tard à un `fetch` sans changer leur signature.
- **Priorités de l'exercice :** l'affichage précis des articles est reporté, et les messages de `RootErrorBoundary` conviennent en l'état. Ne pas les signaler comme des manques en relecture.
- **Données de mock :** le scénario actuel vient d'aidedd.org et la mention du site y est laissée volontairement, pour ne pas oublier de le remplacer. Son Markdown n'est pas soigné, et c'est assumé. Ne pas les signaler en relecture.
- **Identifiants :** les `id` de `Scenario`, `Tag` et `ContentWarning` sont numériques, car l'utilisateur les gère comme de vraies entités en vue de futures features.
- **Tags à deux niveaux :** les libellés comme `mastering:facile` restent ainsi pour le moment, et seront repris plus tard.
- **Modèle `Article` :** `id: number`, `title`, `content`, `author`, `publishedAt: string`. La date reste une chaîne ISO pour l'instant. Les DTO (type brut dans `api/` avec une conversion vers le type métier dans `model/`) sont reportés à plus tard.
- **Routing :** les données sont chargées par des loaders React Router, lus avec `useLoaderData<typeof xxxLoader>()`. Les composants ne sont jamais `async`.
- **Conventions de nommage :**
  - Les exports de l'entité ont des noms explicites (`getAllArticles`, `getArticleById`, `ArticleCard`, `ArticleDetail`), sans alias.
  - Chaque page a son loader dans `pages/<slice>/api/loader.ts`, exporté sous le nom `<slice en camelCase>Loader` (`articleListLoader`, `articleDetailLoader`). Une action suit le même modèle : `api/action.ts`, `<slice en camelCase>Action`.
  - Les fichiers de types s'appellent `model/types.ts`, et les composants `ui/NomDuComposant.tsx`.
  - Les composants utilisent des exports nommés, pas d'export par défaut.
- **Règles FSD appliquées :**
  - Une couche importe uniquement depuis les couches **strictement inférieures**, quelle que soit la distance.
  - Il n'y a pas d'import entre slices d'une même couche.
  - Une API publique (`index.ts`) existe **par slice**, jamais au niveau d'une couche.
  - L'extérieur d'une slice passe toujours par son `index.ts`, avec l'alias `@/`. À l'intérieur, on utilise des imports relatifs directs (`../model/types`) et jamais `..`, pour éviter les dépendances circulaires.
  - L'entité ne connaît pas le routeur : c'est la page qui adapte `params` en arguments métier.
  - Le routeur, dans `app/`, n'importe que des pages, en dehors de `app/` lui-même.
  - `app/` n'a pas de segment `ui` (règle Steiger `no-ui-in-app`) : ses composants sont à sa racine.
  - On utilise `import type` quand seul le type est nécessaire (`verbatimModuleSyntax` est activé).

## État actuel (au 2026-11-02)

Le routeur, le layout, la gestion des erreurs, les liens de la liste vers le détail et l'alias `@/` sont terminés. Les pages liste et détail des scénarios existent, et `/` redirige vers `/scenario`. Les badges, le rendu Markdown, le descellement et le statut dans la liste sont en place : le périmètre de la v1 est implémenté.

```
frontend/src/
├── app/            main.tsx, router.tsx, App.tsx (layout), RootErrorBoundary.tsx
├── pages/
│   ├── article-list/    api/loader.ts, ui/ArticleListPage.tsx, index.ts
│   ├── article-detail/  api/loader.ts, ui/ArticleDetailPage.tsx, index.ts
│   ├── scenario-list/   api/loader.ts, ui/ScenarioListPage.tsx, index.ts
│   └── scenario-detail/ api/loader.ts, api/action.ts, ui/ScenarioDetailPage.tsx, index.ts
├── features/
│   └── unseal-scenario/ api/access.ts, ui/UnsealButton.tsx, ui/SealStatus.tsx, index.ts
├── entities/
│   ├── article/         api/access.ts, model/types.ts, ui/ArticleCard.tsx, ui/ArticleDetail.tsx, index.ts
│   ├── scenario/        api/access.ts, model/types.ts, ui/ScenarioCard.tsx, ui/ScenarioDetail.tsx, ui/ScenarioSealedContent.tsx, index.ts
│   ├── tag/             api/access.ts, model/types.ts, index.ts
│   └── content-warning/ api/access.ts, model/types.ts, index.ts
└── shared/
    ├── mock.ts
    └── ui/              Badge.tsx, BadgeList.tsx, Markdown.tsx, index.ts
```

- L'arbre de routes et le rôle des deux boundaries sont décrits dans `docs/architecture.md`, section « Itération actuelle ».
- Les 404 passent par `throw data(..., { status: 404 })`. La route `*` en lance une pour les URL inconnues.
- Les loaders des scénarios renvoient chaque scénario à plat, complété de ses `tags` et `contentWarnings` résolus. La liste ne charge les tags et les avertissements qu'une fois.
- Les composants de l'entité gardent `data: Scenario` et reçoivent les badges par un slot, la prop `badges` de type `ReactNode`. La page les construit avec `BadgeList`, donc `scenario` n'importe jamais `tag`.
- Seul `shared/ui/Markdown.tsx` importe `react-markdown`.
- Le descellement :
  - `features/unseal-scenario/api/access.ts` lit et écrit la liste des `id` dans le `localStorage`. Une valeur absente, corrompue ou de mauvaise forme donne `[]`.
  - `UnsealButton` est un `<Form method="post">` sans champ, avec un `window.confirm`. Il ne connaît ni l'`id` ni la page.
  - `scenarioDetailAction`, déclarée sur la route `scenario/:id`, valide `params.id` et appelle `unsealScenario`. React Router relance ensuite le loader, sans `useState`.
  - Les deux loaders ajoutent `isUnsealed` à chaque scénario.
  - `ScenarioDetail` reçoit la partie scellée par un slot, `sealedContent`, que la page remplit avec `ScenarioSealedContent` ou `UnsealButton`.
  - Dans la liste, `ScenarioCard` reçoit le statut par un slot dédié, `sealStatus`, que la page remplit avec `SealStatus` (fourni par la feature). Décision de l'utilisateur : le statut n'est pas un badge, car un badge décrit le contenu, alors que le statut décrit la relation de l'utilisateur au scénario.

## Mission en cours : les scénarios

Le modèle et le périmètre de la v1 sont définis dans `docs/data-model.md`. Ils sont implémentés, et `npm run check` passe sans erreur. Le blog est conservé : les scénarios sont un ajout. Les descellements sont stockés dans le `localStorage`, en anticipant qu'un backend le remplacera (voir D5 dans `docs/architecture.md`).

Les liens suivent ce principe : la **page** construit l'URL et enveloppe la carte dans un `<Link>`. L'entité ne dépend pas du routage.

## Points ouverts

- libellés des badges collés à l'affichage : `<p>{badges}</p>` contient des `span` sans espace entre eux ;
- reprise des tags à deux niveaux ;
- boundary spécifique « introuvable » au niveau d'une page ;
- DTO et conversion des dates ;
- fuseau horaire des dates du mock ;
- affichage de `content` et `publishedAt` dans `ArticleDetail` (reporté par l'utilisateur) ;
- route modules `lazy` ;
- intégration de Shadcn (voir les questions ouvertes de `docs/architecture.md`).
