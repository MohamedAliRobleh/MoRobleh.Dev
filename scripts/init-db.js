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
