# Modèle de données — Personnages (v0.1)

> Statut : **validé v0.1** — périmètre : classes/niveaux, caractéristiques, compétences, jets de sauvegarde, identité mécanique, lore.
> Système de référence : **D&D 5e, édition 2024** (`dnd5e-2024`).

## Principes

1. **Trois blocs** : `meta` (technique), `lore` (narratif, commun à tous les systèmes), `sheet` (spécifique au système).
2. **Règle de rangement lore / système** : un champ appartient au **système** dès qu'au moins une règle, un objet magique ou une mécanique le teste ou en dépend. Sinon, il appartient au **lore**.
3. **On ne stocke jamais une valeur calculable.** Seules les données saisies par le joueur sont persistées ; tout le reste est dérivé par des fonctions pures.
4. **Les règles du jeu ne sont pas des données de personnage.** (ex : quelle compétence dépend de quelle caractéristique) → elles relèvent de la *configuration du système*, pas de la base.
5. **Les clés techniques sont en anglais** (`str`, `athletics`…) ; les libellés français relèvent de l'affichage.
6. Le champ `system` de `sheet` est le **discriminant** qui permettra d'ajouter d'autres systèmes (union discriminée côté TS).

---

## 1. Meta

| Champ | Type | Obligatoire | Remarque |
|---|---|---|---|
| `id` | identifiant | oui | |
| `ownerId` | identifiant | oui | référence future vers `user` |
| `createdAt` | date | oui | |
| `updatedAt` | date | oui | |

## 2. Lore (commun à tous les systèmes)

| Champ | Type | Obligatoire | Remarque |
|---|---|---|---|
| `name` | texte | oui | |
| `portraitUrl` | URL | non | |
| `age` | texte | non | texte libre (« la trentaine », « 312 ans »…) |
| `pronouns` | texte | non | |
| `appearance` | texte long | non | taille, poids, yeux, etc. en texte libre |
| `personality` | texte long | non | |
| `ideals` | texte | non | narratif (non mécanique en 2024) |
| `bonds` | texte | non | narratif |
| `flaws` | texte | non | narratif |
| `backstory` | texte long | non | |
| `relations` | liste de *Relation* | non | voir ci-dessous |
| `notes` | texte long | non | |

**Relation**

| Champ | Type | Obligatoire | Remarque |
|---|---|---|---|
| `name` | texte | oui | |
| `kind` | texte | non | allié, rival, famille, mentor… (liste libre en v0.1) |
| `description` | texte | non | |
| `characterId` | identifiant | non | *plus tard* : lien vers un autre personnage |

## 3. Sheet — `dnd5e-2024`

| Champ | Type | Obligatoire | Remarque |
|---|---|---|---|
| `system` | `"dnd5e-2024"` | oui | discriminant |
| `species` | identifiant / texte | oui | mécanique (taille, vitesse, traits) — effets non gérés en v0.1 |
| `background` | identifiant / texte | oui | mécanique en 2024 (bonus de carac, don d'origine, compétences) — effets non gérés en v0.1 |
| `alignment` | énumération | non | mécanique (testé par certains objets) |
| `classes` | liste de *ClassLevel* | oui, ≥ 1 | multiclassage géré dès v0.1 ; le **premier élément est la classe de départ** |
| `abilities` | *Abilities* | oui | scores **finaux** |
| `savingThrows` | *SavingThrowProficiencies* | oui | |
| `skills` | *SkillProficiencies* | oui | |

**Alignement** — `lawful-good`, `neutral-good`, `chaotic-good`, `lawful-neutral`, `neutral`, `chaotic-neutral`, `lawful-evil`, `neutral-evil`, `chaotic-evil`, `unaligned`.

**ClassLevel**

| Champ | Type | Contrainte |
|---|---|---|
| `class` | identifiant | barbarian, bard, cleric, druid, fighter, monk, paladin, ranger, rogue, sorcerer, warlock, wizard |
| `subclass` | identifiant | facultatif (obtenue au niveau 3 en 2024) |
| `level` | entier | 1–20 |

Contrainte globale : somme des `level` ≤ 20.

**Abilities** — un score entier (1–30) pour chacune :

| Clé | Libellé |
|---|---|
| `str` | Force |
| `dex` | Dextérité |
| `con` | Constitution |
| `int` | Intelligence |
| `wis` | Sagesse |
| `cha` | Charisme |

En v0.1, on stocke le **score final** (pas de décomposition base + bonus).

**SavingThrowProficiencies** — un booléen par caractéristique (`str` … `cha`).
Stocké plutôt que déduit de la classe de départ, car des dons (ex. *Résilient*) peuvent en ajouter.

**SkillProficiencies** — un niveau de maîtrise par compétence : `none` | `proficient` | `expertise`.

---

## 4. Configuration du système (règles, non persistées par personnage)

**Compétence → caractéristique**

| Carac | Compétences |
|---|---|
| `str` | `athletics` (Athlétisme) |
| `dex` | `acrobatics` (Acrobaties), `sleight-of-hand` (Escamotage), `stealth` (Discrétion) |
| `con` | — |
| `int` | `arcana` (Arcanes), `history` (Histoire), `investigation` (Investigation), `nature` (Nature), `religion` (Religion) |
| `wis` | `animal-handling` (Dressage), `insight` (Intuition), `medicine` (Médecine), `perception` (Perception), `survival` (Survie) |
| `cha` | `deception` (Tromperie), `intimidation` (Intimidation), `performance` (Représentation), `persuasion` (Persuasion) |

## 5. Valeurs calculées (jamais stockées)

| Valeur | Formule | Dépend de |
|---|---|---|
| `totalLevel` | somme des `classes[].level` | classes |
| `proficiencyBonus` | `2 + floor((totalLevel − 1) / 4)` → +2 (1–4), +3 (5–8), +4 (9–12), +5 (13–16), +6 (17–20) | totalLevel |
| `abilityModifier(a)` | `floor((score − 10) / 2)` | abilities |
| `savingThrow(a)` | `mod(a) + (maîtrisé ? PB : 0)` | mod, savingThrows, PB |
| `skill(s)` | `mod(carac(s)) + PB × {none: 0, proficient: 1, expertise: 2}` | mod, skills, PB |

Graphe de dépendances :

```
classes ──► totalLevel ──► proficiencyBonus ──┐
                                              ├──► savingThrows (calculés)
abilities ──► modifiers ──────────────────────┤
                                              └──► skills (calculés)
```

---

## Hors périmètre v0.1 (à venir)

- Effets mécaniques de l'espèce et de l'historique (bonus de carac, dons, maîtrises automatiques)
- Règles d'exception propres aux classes (ex. *Touche-à-tout* du barde) — à implémenter **dans le système**, séparément
- Perception passive, initiative, CA, PV, vitesse
- Inventaire, sorts, dons, langues, maîtrises d'outils
- Liens `Relation.characterId` vers d'autres personnages
- Autres systèmes de jeu
