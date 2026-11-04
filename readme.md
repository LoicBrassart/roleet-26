# Roleet, edition 2026

N-ème reboot de ce projet

## But de l'itération

- Etudier le FSD en React
- Le blog (`frontend/`) a servi d'exercice pour apprendre, et il est conservé
- Le recueil de scénarios de JDR décrit dans `docs/` : v1 en place

## Stack

- Full TS
- React

## Vérifications

Depuis `frontend/` : `npm run check` (ESLint, Steiger, puis `tsc` et build)

---

# FSD: Feature-Sliced Design

## Concepts

- On décompose le site selon six _layers_ (cf plus bas), découpées en Slices (sauf `app` et `shared`), elles mêmes découpées en Segments
- Tout module ne peut importer **que** depuis une Layer strictement inférieure à lui

## 6 Layers

(`\*`: ne comportent pas de Slices. Une septième layer, `processes`, existe mais est dépréciée)

- `app`\*: Initialisation : providers, routeur, styles globaux
- `pages`: Un écran complet, branché sur une route
- (`widgets`): Gros bloc d'UI autonome, réutilisable entre pages
- (`features`): Une action utilisateur qui a de la valeur métier
- `entities`: Les concepts métier : données et affichage de base
- `shared`\*: Le générique, sans aucune notion métier

## Slices

Une Slice regroupe le code d'un même concept (ex: `entities/article`, `pages/article-list`). Elle contient des Segments et une API publique.

- index.ts: l'API publique de la Slice

## Segments

- ui: les affichages "de base": card, aperçu, ...
- api: les fonctions permettant de récupérer les données
- model: les types, (les states)
