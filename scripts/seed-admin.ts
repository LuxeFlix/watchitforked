import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

async function seedAdmin() {
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const username = process.argv[2]
  const password = process.argv[3]

  if (!username || !password) {
    console.error('Usage: npx tsx scripts/seed-admin.ts <username> <password>')
    process.exit(1)
  }

  const sql = neon(DATABASE_URL)

  // Create table if not exists
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `

  const hash = await bcrypt.hash(password, 12)

  // Upsert: insert or update password if username exists
  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${hash})
    ON CONFLICT (username)
    DO UPDATE SET password_hash = ${hash}
  `

  console.log(`Admin user "${username}" created/updated successfully.`)
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
