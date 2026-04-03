import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin-login@test.com' },
    update: {},
    create: {
      name: 'Admin E2E',
      email: 'admin-login@test.com',
      password_hash: await bcrypt.hash('123456', 6),
      role: 'ADMIN',
      validated_at: new Date(),
    },
  })

  await prisma.user.upsert({
    where: { email: 'member@test.com' },
    update: {},
    create: {
      name: 'Member User',
      email: 'member@test.com',
      password_hash: await bcrypt.hash('123456', 6),
      role: 'MEMBER',
      validated_at: new Date(),
    },
  })

  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@test.com',
      password_hash: await bcrypt.hash('123456', 6),
      role: 'USER',
      validated_at: null,
    },
  })

  await prisma.user.upsert({
    where: { email: 'deleted@test.com' },
    update: {},
    create: {
      name: 'Deleted User',
      email: 'deleted@test.com',
      password_hash: await bcrypt.hash('123456', 6),
      role: 'USER',
      deleted_at: new Date(),
    },
  })

  await prisma.user.upsert({
    where: { email: 'password-change@test.com' },
    update: {},
    create: {
      name: 'Password Change',
      email: 'password-change@test.com',
      password_hash: await bcrypt.hash('123456', 6),
      role: 'ADMIN',
      validated_at: new Date(),
    },
  })

  console.log('Seed concluído.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
