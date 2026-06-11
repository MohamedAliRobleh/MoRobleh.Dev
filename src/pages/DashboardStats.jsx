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
