import { execSync } from 'child_process'

export default async function globalSetup() {
  execSync('pnpm --filter api exec prisma migrate reset --force --skip-generate', {
    stdio: 'inherit',
  })
}
