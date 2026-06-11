# Suivi des visiteurs privé — Design

**Date :** 2026-06-11
**Statut :** validé

## Objectif

Compter les visiteurs du portfolio (aujourd'hui, ce mois, total depuis le début) et consulter ces chiffres sur une page cachée, accessible uniquement par le propriétaire. Rien n'est affiché aux visiteurs du site.

## Architecture

```
Visiteur → App React → POST /api/visit (1×/session) → Neon Postgres (table visits)
Propriétaire → /dashboard-stats → GET /api/stats (header secret) → chiffres
```

### Base de données — Neon Postgres

Base Neon existante du propriétaire. Une seule table :

```sql
CREATE TABLE IF NOT EXISTS visits (
  day   DATE PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);
```

Une ligne par jour. Tous les agrégats en dérivent :
- **Aujourd'hui** : ligne du jour courant
- **Ce mois** : `SUM(count)` sur le mois courant
- **Total** : `SUM(count)` sur toute la table
- **Historique** : 30 derniers jours (par jour) et 12 derniers mois (groupé par mois)

Aucune donnée personnelle stockée (pas d'IP, pas de cookie) → pas de bannière RGPD nécessaire.

### API — Fonctions serverless Vercel (`api/`)

Driver : `@neondatabase/serverless`.

- **`POST /api/visit`** — incrémente le compteur du jour :
  `INSERT INTO visits (day, count) VALUES (CURRENT_DATE, 1) ON CONFLICT (day) DO UPDATE SET count = visits.count + 1`.
  Appelée par le front une seule fois par session (flag dans `sessionStorage`), pour ne pas compter les rechargements ni les navigations internes.
- **`GET /api/stats`** — renvoie `{ today, month, total, last30Days, last12Months }`.
  Protégée : refuse (401) si le header `x-stats-key` ne correspond pas à la variable d'environnement `STATS_SECRET`. La protection est côté serveur, pas seulement côté client.

### Variables d'environnement

| Variable | Où | Rôle |
|---|---|---|
| `DATABASE_URL` | Vercel + `.env` local | Connection string Neon (jamais commitée) |
| `STATS_SECRET` | Vercel + `.env` local | Mot de passe d'accès aux stats |

### Front — Page cachée `/dashboard-stats`

- Route React ajoutée au router, non référencée dans le menu ni le sitemap.
- Affiche un champ mot de passe ; le mot de passe est gardé en `sessionStorage` après succès.
- Affiche : visiteurs aujourd'hui / ce mois / total + historique 30 jours et 12 mois.
- Style cohérent avec le reste du portfolio (dark premium).
- Le tracking (`POST /api/visit`) n'est PAS déclenché depuis cette page, pour ne pas compter les visites du propriétaire.

## Gestion des erreurs

- Si `POST /api/visit` échoue, le site fonctionne normalement (appel fire-and-forget, erreurs silencieuses côté visiteur).
- `GET /api/stats` : 401 sans secret valide, 500 avec message générique si la base est injoignable.

## Tests / Vérification

- En local : `vercel dev` (les fonctions `api/` ne tournent pas sous `vite dev` seul) ou test direct contre la prod après déploiement.
- Vérifier : incrément en base après visite, double visite dans la même session ne compte qu'une fois, `/api/stats` refuse sans secret, la page affiche les bons chiffres.

## Hors périmètre (YAGNI)

- Stats par page, par pays, par navigateur, temps de visite.
- Graphiques avancés. (Vercel Analytics pourra compléter plus tard si besoin.)
