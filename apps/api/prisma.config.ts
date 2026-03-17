import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Fallback allows `prisma generate` to run without DATABASE_URL.
    // Migrations and db:push require DATABASE_URL set in .env.
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/placeholder',
  },
})
