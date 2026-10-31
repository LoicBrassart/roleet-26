# Roleet, edition 2026

N-ème reboot de ce projet

## But de l'itération

- Etudier le FSD en React

## Stack

- Full TS
- React

---

# FSD: Feature-Sliced Design

## Concepts

- On décompose le site selon sept _layers_ (cf plus bas), contenant elles mêmes des Slices
- Tout module ne peut importer **que** depuis une Layer strictement inférieure à lui

## 7 Layers

(`\*`: ne comportent pas de Slices, cf plus bas)

- `app`\*: Initialisation : providers, routeur, styles globaux
- `pages`: Un écran complet, branché sur une route
- (`widgets`): Gros bloc d'UI autonome, réutilisable entre pages
- (`features`): Une action utilisateur qui a de la valeur métier
- `entities`: Les concepts métier : données et affichage de base
- `shared`\*: Le générique, sans aucune notion métier

## slices

- ui: les affichages "de base": card, aperçu, ...
- api: les fonctions permettant de récupérer les données
- model: les types, (les states)
- index.ts: l'API publique de la Slice
