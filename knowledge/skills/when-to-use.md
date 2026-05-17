# Skills: Quando Usar

## Tabela de decisão

| Tarefa | Skill | Obrigatoriedade |
|---|---|---|
| Criar módulo backend novo | `.agents/skills/create-module` | ✓ Obrigatório |
| Criar página ou componente novo | `.agents/skills/frontend-design` | ✓ Obrigatório |
| Criar Issue no GitHub | `.agents/skills/user-story` | ✓ Obrigatório |
| Validar código antes de abrir PR | `.agents/skills/qa-check` | ✓ Obrigatório |
| Qualquer integração com Stripe | `.agents/skills/stripe-best-practices` | ✓ Obrigatório |
| Automação de browser / testes visuais | `.agents/skills/playwright-cli` | → Recomendado |

## Notas por skill

### create-module
Nunca criar estrutura de módulo backend manualmente. A skill garante todos os artefatos:
controller, service, repository interface, PrismaRepository, InMemoryRepository, factory,
testes unitários e E2E. Ver `knowledge/patterns/backend-module.md` para o padrão esperado.

### frontend-design
Aplica-se tanto ao **apps/admin** (Vite + TanStack Router + shadcn style new-york) quanto
ao **apps/web** (Next.js 16 + shadcn + design system do projeto).

**Especificar sempre o app alvo no request** — as conventions diferem:
- Admin: componentes shadcn/ui existentes em `src/components/ui/`, UI pt-BR
- Web: consultar o design system do projeto antes de implementar UI

Ajustes pontuais em componentes existentes (ex: corrigir padding, trocar cor) dispensam a skill.

### qa-check
Executar antes de criar qualquer PR, mesmo que você considere o código pronto.
A skill valida: estrutura de arquivos, padrão de testes, E2E, e prepara o rascunho do PR
fechando a Issue correspondente (`Closes #N`).

### user-story
Aguarda aprovação antes de criar a Issue no GitHub. Não cria automaticamente.

### stripe-best-practices
Usar antes de qualquer código de pagamento. A skill garante uso correto da API atual
do Stripe (CheckoutSessions/PaymentIntents — nunca Charges API deprecada).

### playwright-cli
Útil para exploração visual, debugging de testes E2E e automação de tarefas de browser.
Não substitui a escrita de testes Playwright convencionais.
