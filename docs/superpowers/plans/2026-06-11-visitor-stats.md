# Visitor Stats (privé) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Compter les visiteurs (jour / mois / total) dans Neon Postgres et les afficher sur une page cachée `/dashboard-stats` protégée par mot de passe côté serveur.

**Architecture:** Le front React appelle `POST /api/visit` une fois par session (fonction serverless Vercel qui upsert une ligne par jour dans Neon). Une page React cachée appelle `GET /api/stats` avec un header secret vérifié contre `STATS_SECRET`.

**Tech Stack:** React 19 + Vite (SPA existante), Vercel Functions (dossier `api/`), `@neondatabase/serverless`, Neon Postgres.

**Spec:** `docs/superpowers/specs/2026-06-11-visitor-stats-design.md`

**Note timezone :** les jours sont comptés en UTC (`CURRENT_DATE` côté Neon). Acceptable pour un compteur de visiteurs.

**Note tests :** le repo n'a aucun test runner ; la vérification est manuelle (curl + navigateur), commandes exactes fournies à chaque tâche.

---

### Task 1: Dépendance + variables d'environnement

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env`
- Modify: `.env.example`

- [x] **Step 1: Installer le driver Neon**

Run: `npm install @neondatabase/serverless`
Expected: ajouté dans `dependencies` de `package.json`.

- [x] **Step 2: Générer le secret des stats**

Run: `node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"`
Garder la valeur générée : c'est `STATS_SECRET` (le « mot de passe » du propriétaire).

- [x] **Step 3: Compléter `.env`** (jamais commité — vérifié dans `.gitignore`)

Ajouter à `.env` :

```
DATABASE_URL=<connection string Neon fournie par le propriétaire — jamais dans git>
STATS_SECRET=<valeur générée au Step 2>
```

- [x] **Step 4: Compléter `.env.example`** (commité, sans valeurs réelles)

Ajouter à `.env.example` :

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
STATS_SECRET=change-me
```

- [x] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: add @neondatabase/serverless and stats env template"
```

---

### Task 2: Créer la table `visits` dans Neon

**Files:**
- Create: `scripts/init-db.js`

- [x] **Step 1: Écrire le script d'init**

`scripts/init-db.js` :

```js
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS visits (
    day   DATE PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
  )
`;

const [{ exists }] = await sql`
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'visits'
  ) AS exists
`;
console.log('Table visits exists:', exists);
```

- [x] **Step 2: Exécuter le script**

Run: `node --env-file=.env scripts/init-db.js`
Expected: `Table visits exists: true`

- [x] **Step 3: Commit**

```bash
git add scripts/init-db.js
git commit -m "feat: add Neon visits table init script"
```

---

### Task 3: Fonction serverless `POST /api/visit`

**Files:**
- Create: `api/visit.js`

- [x] **Step 1: Écrire la fonction**

`api/visit.js` :

```js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO visits (day, count)
      VALUES (CURRENT_DATE, 1)
      ON CONFLICT (day) DO UPDATE SET count = visits.count + 1
    `;
    return res.status(204).end();
  } catch (err) {
    console.error('visit error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

- [x] **Step 2: Vérification statique**

Run: `node --check api/visit.js`
Expected: aucune sortie (syntaxe OK). Le test fonctionnel se fait en Task 7 après déploiement (les fonctions `api/` ne tournent pas sous `vite dev`).

- [x] **Step 3: Commit**

```bash
git add api/visit.js
git commit -m "feat: add /api/visit endpoint incrementing daily counter"
```

---

### Task 4: Fonction serverless `GET /api/stats` (protégée)

**Files:**
- Create: `api/stats.js`

- [x] **Step 1: Écrire la fonction**

`api/stats.js` :

```js
import { timingSafeEqual } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

function isAuthorized(req) {
  const provided = req.headers['x-stats-key'];
  const secret = process.env.STATS_SECRET;
  if (!provided || !secret) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const [totals] = await sql`
      SELECT
        COALESCE(SUM(count) FILTER (WHERE day = CURRENT_DATE), 0)::int AS today,
        COALESCE(SUM(count) FILTER (
          WHERE date_trunc('month', day) = date_trunc('month', CURRENT_DATE)
        ), 0)::int AS month,
        COALESCE(SUM(count), 0)::int AS total
      FROM visits
    `;
    const last30Days = await sql`
      SELECT to_char(day, 'YYYY-MM-DD') AS day, count
      FROM visits
      WHERE day > CURRENT_DATE - 30
      ORDER BY day
    `;
    const last12Months = await sql`
      SELECT to_char(date_trunc('month', day), 'YYYY-MM') AS month,
             SUM(count)::int AS count
      FROM visits
      WHERE day >= date_trunc('month', CURRENT_DATE) - interval '11 months'
      GROUP BY 1
      ORDER BY 1
    `;
    return res.status(200).json({ ...totals, last30Days, last12Months });
  } catch (err) {
    console.error('stats error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

- [x] **Step 2: Vérification statique**

Run: `node --check api/stats.js`
Expected: aucune sortie. Test fonctionnel en Task 7.

- [x] **Step 3: Commit**

```bash
git add api/stats.js
git commit -m "feat: add secret-protected /api/stats endpoint"
```

---

### Task 5: Tracking côté front (1×/session)

**Files:**
- Modify: `src/App.jsx` (imports lignes 1-11, composant `App` lignes 92-112)

- [x] **Step 1: Ajouter le hook de tracking dans `App.jsx`**

Dans les imports, `useEffect` est déjà importé ligne 3. Ajouter ce composant juste au-dessus de `function App()` :

```jsx
function VisitTracker() {
  useEffect(() => {
    if (import.meta.env.DEV) return;
    if (window.location.pathname === '/dashboard-stats') return;
    if (sessionStorage.getItem('visit-tracked')) return;
    sessionStorage.setItem('visit-tracked', '1');
    fetch('/api/visit', { method: 'POST' }).catch(() => {});
  }, []);
  return null;
}
```

Puis dans le JSX de `App`, ajouter `<VisitTracker />` juste après `<CustomCursor />` :

```jsx
    <>
      <CustomCursor />
      <VisitTracker />
      <ScrollToTop />
```

Règles couvertes : pas de double comptage par session (`sessionStorage`), pas de comptage en dev local (`import.meta.env.DEV`), pas de comptage quand le propriétaire ouvre `/dashboard-stats` directement.

- [x] **Step 2: Vérifier que le build passe**

Run: `npm run build`
Expected: `✓ built in …` sans erreur.

- [x] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: track one visit per session via /api/visit"
```

---

### Task 6: Page cachée `/dashboard-stats`

**Files:**
- Create: `src/pages/DashboardStats.jsx`
- Modify: `src/App.jsx` (ajout import + route, lignes 8-11 et 103-106)
- Modify: `src/App.css` (ajout styles en fin de fichier)

- [x] **Step 1: Créer la page**

`src/pages/DashboardStats.jsx` :

```jsx
import { useEffect, useState, useCallback } from 'react';

const KEY_STORAGE = 'stats-key';

export default function DashboardStats() {
  const [keyInput, setKeyInput] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async (key) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stats', { headers: { 'x-stats-key': key } });
      if (res.status === 401) {
        sessionStorage.removeItem(KEY_STORAGE);
        setError('Mot de passe incorrect.');
        return;
      }
      if (!res.ok) {
        setError('Erreur serveur, réessaie plus tard.');
        return;
      }
      sessionStorage.setItem(KEY_STORAGE, key);
      setStats(await res.json());
    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORAGE);
    if (saved) fetchStats(saved);
  }, [fetchStats]);

  if (!stats) {
    return (
      <div className="stats-page">
        <form
          className="stats-login glass-card"
          onSubmit={(e) => { e.preventDefault(); fetchStats(keyInput); }}
        >
          <h1>Statistiques privées</h1>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Mot de passe"
            autoFocus
          />
          <button type="submit" disabled={loading || !keyInput}>
            {loading ? '…' : 'Accéder'}
          </button>
          {error && <p className="stats-error">{error}</p>}
        </form>
      </div>
    );
  }

  const maxDay = Math.max(1, ...stats.last30Days.map((d) => d.count));
  const maxMonth = Math.max(1, ...stats.last12Months.map((m) => m.count));

  return (
    <div className="stats-page">
      <h1>Visiteurs</h1>
      <div className="stats-cards">
        <div className="stats-card glass-card">
          <span className="stats-value">{stats.today}</span>
          <span className="stats-label">Aujourd'hui</span>
        </div>
        <div className="stats-card glass-card">
          <span className="stats-value">{stats.month}</span>
          <span className="stats-label">Ce mois</span>
        </div>
        <div className="stats-card glass-card">
          <span className="stats-value">{stats.total}</span>
          <span className="stats-label">Total</span>
        </div>
      </div>

      <h2>30 derniers jours</h2>
      <div className="stats-bars">
        {stats.last30Days.map((d) => (
          <div key={d.day} className="stats-bar-row">
            <span className="stats-bar-label">{d.day.slice(5)}</span>
            <div className="stats-bar" style={{ width: `${(d.count / maxDay) * 100}%` }} />
            <span className="stats-bar-count">{d.count}</span>
          </div>
        ))}
        {stats.last30Days.length === 0 && <p className="stats-empty">Aucune visite encore.</p>}
      </div>

      <h2>12 derniers mois</h2>
      <div className="stats-bars">
        {stats.last12Months.map((m) => (
          <div key={m.month} className="stats-bar-row">
            <span className="stats-bar-label">{m.month}</span>
            <div className="stats-bar" style={{ width: `${(m.count / maxMonth) * 100}%` }} />
            <span className="stats-bar-count">{m.count}</span>
          </div>
        ))}
        {stats.last12Months.length === 0 && <p className="stats-empty">Aucune visite encore.</p>}
      </div>
    </div>
  );
}
```

- [x] **Step 2: Ajouter la route dans `src/App.jsx`**

Import (après la ligne `import Contact from './pages/Contact';`) :

```jsx
import DashboardStats from './pages/DashboardStats';
```

Route (après la route `/contact`) :

```jsx
<Route path="/dashboard-stats" element={<PageWrapper><DashboardStats /></PageWrapper>} />
```

- [x] **Step 3: Ajouter les styles en fin de `src/App.css`**

```css
/* ===== Dashboard stats (page privée) ===== */
.stats-page {
  max-width: 720px;
  margin: 0 auto;
  padding: calc(var(--navbar-height) + 48px) 24px 80px;
  min-height: 70vh;
}
.stats-page h1 { font-size: 2rem; margin-bottom: 28px; }
.stats-page h2 { font-size: 1.15rem; margin: 36px 0 14px; color: var(--text-muted); }
.stats-login {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 360px;
  margin: 10vh auto 0;
  padding: 32px;
  border-radius: var(--radius);
}
.stats-login input {
  background: var(--bg-tertiary);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  color: var(--text);
  font-size: 1rem;
}
.stats-login button {
  background: var(--accent);
  border: none;
  border-radius: var(--radius-sm);
  padding: 12px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.stats-login button:disabled { opacity: 0.5; cursor: default; }
.stats-error { color: #f87171; font-size: 0.9rem; margin: 0; }
.stats-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.stats-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 12px;
  border-radius: var(--radius);
}
.stats-value {
  font-family: 'Syne', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--accent-light);
}
.stats-label { color: var(--text-muted); font-size: 0.9rem; }
.stats-bars { display: flex; flex-direction: column; gap: 6px; }
.stats-bar-row { display: flex; align-items: center; gap: 10px; }
.stats-bar-label {
  width: 56px;
  flex-shrink: 0;
  color: var(--text-dim);
  font-size: 0.8rem;
  text-align: right;
}
.stats-bar {
  height: 14px;
  min-width: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-cyan));
  border-radius: 4px;
}
.stats-bar-count { color: var(--text-muted); font-size: 0.8rem; }
.stats-empty { color: var(--text-dim); }
@media (max-width: 560px) {
  .stats-cards { grid-template-columns: 1fr; }
}
```

- [x] **Step 4: Vérifier le build + rendu local**

Run: `npm run build`
Expected: build OK.

Run: `npm run dev` puis ouvrir `http://localhost:5174/dashboard-stats`
Expected: formulaire mot de passe affiché avec le style dark. (L'API ne répond pas en dev — saisir un mot de passe affichera « Impossible de joindre le serveur », c'est attendu.)

- [x] **Step 5: Commit**

```bash
git add src/pages/DashboardStats.jsx src/App.jsx src/App.css
git commit -m "feat: add hidden /dashboard-stats page with password gate"
```

---

### Task 7: Variables d'environnement Vercel + déploiement + vérification

**Files:** aucun (configuration + vérification).

- [x] **Step 1: Ajouter les variables sur Vercel**

Via le dashboard Vercel (Project → Settings → Environment Variables), environnement **Production** (+ Preview si souhaité) :
- `DATABASE_URL` = la connection string Neon (même valeur que `.env`)
- `STATS_SECRET` = la valeur générée en Task 1

(Si le CLI Vercel est installé : `vercel env add DATABASE_URL production` puis `vercel env add STATS_SECRET production`.)

- [x] **Step 2: Déployer**

```bash
git push origin main
```

Attendre la fin du déploiement Vercel (dashboard ou notification GitHub).

- [x] **Step 3: Vérifier `/api/stats` refuse sans secret**

Run: `curl -s -o NUL -w "%{http_code}" https://<domaine-du-site>/api/stats`
Expected: `401`

- [x] **Step 4: Vérifier `/api/stats` avec secret**

Run: `curl -s -H "x-stats-key: <STATS_SECRET>" https://<domaine-du-site>/api/stats`
Expected: JSON `{"today":0,"month":0,"total":0,"last30Days":[],"last12Months":[]}` (ou valeurs déjà > 0).

- [x] **Step 5: Vérifier le comptage**

Ouvrir le site en navigation privée, puis relancer la commande du Step 4.
Expected: `today`, `month`, `total` incrémentés de 1. Recharger la page du site dans le même onglet privé puis revérifier : pas d'incrément supplémentaire (même session).

- [x] **Step 6: Vérifier la page cachée**

Ouvrir `https://<domaine-du-site>/dashboard-stats`, entrer `STATS_SECRET`.
Expected: cartes Aujourd'hui / Ce mois / Total + barres 30 jours et 12 mois.

- [x] **Step 7: Commit final (plan coché)**

```bash
git add docs/superpowers/plans/2026-06-11-visitor-stats.md
git commit -m "docs: mark visitor stats plan complete"
```
