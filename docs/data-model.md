# Modèle de données — Scénarios (v1)

> Statut : **validé v1**, implémentation en cours.
> Périmètre : un recueil de scénarios originaux à l'usage des meneurs, scellés par défaut.

## Principes

1. **Deux blocs** : la `vitrine` aide à choisir un scénario, le `scellé` sert à le mener.
2. **La vitrine ne contient aucun spoiler.** Le contenu scellé n'apparaît jamais dans la liste, même une fois le scénario descellé : on le lit sur la page de détail.
3. **Le descellement n'appartient pas au scénario.** Le scénario est le même pour tout le monde, alors que le descellement concerne un utilisateur. Il est donc stocké à part.
4. **Le descellement est définitif.** Il n'y a que deux états, scellé et descellé, et on ne peut pas resceller.
5. **On référence, on ne copie pas.** Un scénario stocke les `id` de ses tags et de ses avertissements, jamais leurs libellés.
6. **Les identifiants sont numériques** : scénarios, tags et avertissements sont gérés comme de vraies entités. Les noms de champs sont en anglais, et les libellés français relèvent de l'affichage.

---

## 1. Scénario

| Bloc | Champ | Type | Obligatoire | Remarque |
|---|---|---|---|---|
| Vitrine | `id` | nombre | oui | stable : le descellement s'y réfère |
| Vitrine | `title` | texte | oui | sans spoiler |
| Vitrine | `teaser` | texte court | oui | sans spoiler |
| Vitrine | `author` | texte | oui | |
| Vitrine | `tagIds` | liste de nombres | non | références vers `tag` |
| Vitrine | `contentWarningIds` | liste de nombres | non | références vers `content-warning` |
| Scellé | `synopsis` | Markdown | oui | la vérité de l'histoire, intrigue et twists compris |
| Scellé | `content` | Markdown | oui | le scénario à mener |

## 2. Tag

Sert à découvrir des contenus. Les tags seront utilisés dans toute l'application, pas seulement sur les scénarios.

| Champ | Type | Obligatoire | Remarque |
|---|---|---|---|
| `id` | nombre | oui | |
| `label` | texte | oui | modifiable sans toucher aux scénarios |

Certains libellés portent pour l'instant deux niveaux d'information (`mastering:facile`, `level:bas`). Ce choix est provisoire et sera repris plus tard.

## 3. Avertissement de contenu (`content-warning`)

Sert à protéger : il signale un contenu qui peut blesser ou mettre mal à l'aise un membre de la table, et qui ne va pas de soi au vu du genre. Il s'affiche comme un tag, mais reste une donnée distincte, toujours visible avant le descellement. Sa formulation reste générique pour limiter les spoilers.

| Champ | Type | Obligatoire |
|---|---|---|
| `id` | nombre | oui |
| `label` | texte | oui |

La liste est fermée, et sera adaptée au besoin :

| `id` | Catégorie | Exemples |
|---|---|---|
| 1 | Violences sexuelles | agression, harcèlement, coercition |
| 2 | Violences sur enfants | maltraitance, mise en danger ou mort d'un enfant |
| 3 | Suicide et automutilation | y compris évoqués ou passés |
| 4 | Torture et gore | sévices détaillés, mutilations, horreur corporelle |
| 5 | Violences familiales ou conjugales | emprise, abus au sein d'un couple ou d'une famille |
| 6 | Discriminations | racisme, sexisme, homophobie, transphobie, validisme, mis en scène de façon marquée |
| 7 | Santé mentale | psychose, traumatisme, internement |
| 8 | Addictions | drogue, alcool, dépendance |
| 9 | Maladie et deuil | maladie grave, agonie, grossesse et perte d'un enfant |
| 10 | Perte de contrôle du personnage | possession, domination mentale, personnage joué contre son gré |
| 11 | Phobies courantes | araignées, insectes, enfermement, noyade |

## 4. Descellements

La liste des `id` de scénarios descellés.

En v1, sans authentification, elle est conservée dans le `localStorage` du navigateur. Cela a deux conséquences assumées :
- « définitif » veut dire : sur cet appareil, tant que le navigateur n'est pas vidé ;
- le sceau protège des spoilers accidentels, pas d'un tricheur, puisque le contenu scellé est déjà présent côté navigateur.

Un backend remplacera ce stockage : seul l'endroit où vit cette liste changera.

## 5. Stockage en v1

| Donnée | Stockage |
|---|---|
| Scénarios | mock |
| Tags | mock |
| Avertissements de contenu | mock |
| Descellements | `localStorage` |

Le mock (`shared/mock.ts`) contient des **données provisoires** : le texte du scénario actuel vient d'aidedd.org, et la mention du site y est laissée volontairement pour ne pas oublier de le remplacer. Les contenus définitifs seront originaux.

---

## Hors périmètre v1 (à venir)

- **Reprise des tags à deux niveaux** (voir section 2).
- **Réglage de masquage des contenus sensibles :** un réglage utilisateur, à configurer à l'inscription, qui ne montre jamais les scénarios portant certains avertissements. À prévoir :
  - un choix « ne rien masquer » en un clic ;
  - un réglage modifiable à tout moment ;
  - une mention du nombre de scénarios masqués, sans détail.
- **Encarts de différents types dans le Markdown :** piste à étudier, `remark-directive`. `synopsis` et `content` resteront de simples chaînes.
- **Éditeurs et CRUD :** ils ajouteront probablement un statut de brouillon et des dates de création et de modification.
- Authentification et suivi par compte
- Filtres et recherche avancés
- Campagnes
