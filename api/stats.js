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
