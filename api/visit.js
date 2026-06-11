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
