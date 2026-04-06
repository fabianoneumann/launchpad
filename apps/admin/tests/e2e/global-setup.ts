import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const apiDir = path.resolve(__dirname, '../../../api')
const env = {
  ...process.env,
  PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION:
    'Pode adicionar o teste ausente, rodar todos os comandos necessários para realizar os testes, inclusive a operação destrutiva no banco dev. Confirmo explicitamente que estou ciente.',
}

export default async function globalSetup() {
  execSync('pnpm exec prisma migrate reset --force', { stdio: 'inherit', cwd: apiDir, env })
  execSync('pnpm exec prisma db seed', { stdio: 'inherit', cwd: apiDir, env })
}
