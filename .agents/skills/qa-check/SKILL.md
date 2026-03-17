---
name: qa-check
description: Valida a qualidade de um módulo do backend (apps/api) no projeto eco-iguassu verificando padrões arquiteturais, cobertura de testes e critérios de aceite da Issue. Se aprovado, apresenta rascunho de Pull Request para o usuário revisar e cria no GitHub. Use esta skill quando o usuário disser que terminou de implementar uma funcionalidade e quer validar antes de abrir PR — frases como "o módulo está pronto", "pode revisar o que fiz", "quero abrir o PR", "terminei o tours", "faz o QA".
---

O usuário terminou de implementar um módulo e quer validar a qualidade antes de mergear. Seu papel é fazer uma revisão sistemática — arquitetura, padrões, testes — e, se tudo estiver aprovado, preparar o Pull Request que fecha a Issue correspondente.

## Informações necessárias

Antes de começar, confirme com o usuário:
1. **Qual módulo** foi implementado (ex: `tours`, `bookings`)
2. **Número da Issue** que será fechada pelo PR (ex: `#7`)
3. **Nome da branch** atual (ex: `feat/tours-module`)

Se o usuário não souber o número da Issue, consulte as Issues abertas no GitHub (repositório `fabianoneumann/eco-iguassu`) para identificar a correta.

## Checklist de Validação

Execute cada verificação lendo os arquivos do módulo. Para cada item, registre ✅ (aprovado), ⚠️ (atenção) ou ❌ (reprovado).

### Estrutura de Arquivos

- [ ] Módulo está em `apps/api/src/modules/[nome]/`
- [ ] Interface do repositório existe em `src/repositories/[nome]-repository.ts`
- [ ] Implementação Prisma existe em `src/repositories/prisma/prisma-[nome]-repository.ts`
- [ ] In-memory repository existe em `src/repositories/in-memory/in-memory-[nome]-repository.ts`
- [ ] Nome do arquivo in-memory não tem typos (`repository`, não `ropository`)
- [ ] Factory(ies) existem em `src/shared/factories/`
- [ ] Rotas registradas no `app.ts`

### Camada de Controller

- [ ] Controller não contém lógica de negócio
- [ ] Controller não importa `prisma` diretamente
- [ ] Toda rota com body/params/query tem validação Zod
- [ ] Não há `try/catch` para erros de domínio (o error handler global trata)
- [ ] Rotas protegidas têm `verifyJWT` em `onRequest`
- [ ] Rotas com RBAC usam `verifyUserRole` com papel correto

### Camada de Service

- [ ] Service não importa `fastify`, `FastifyRequest` ou `FastifyReply`
- [ ] Service não importa `prisma` diretamente
- [ ] Service tem interfaces `Request` e `Response` tipadas
- [ ] Service expõe método `execute()`
- [ ] Erros de domínio são lançados como classes que estendem `Error`

### Camada de Repositório

- [ ] Interface define apenas os métodos usados (sem métodos fantasma)
- [ ] Implementação Prisma implementa todos os métodos da interface
- [ ] In-memory implementa todos os métodos da interface
- [ ] In-memory expõe `public items[]` para setup dos testes

### Middlewares

- [ ] `verifyJWT` usa `return` antes de `reply.send()` em caso de erro
- [ ] `verifyUserRole` usa hierarquia (`roleHierarchy[role] < roleHierarchy[required]`), não igualdade estrita
- [ ] `verifyUserRole` usa `return` antes de `reply.send()`

### Testes Unitários

- [ ] Existe ao menos um `.service.spec.ts` por operação relevante
- [ ] Testes usam `InMemory[Nome]Repository`, nunca Prisma
- [ ] Testes seguem padrão `beforeEach` + instanciação de `sut`
- [ ] Há testes para o caminho feliz
- [ ] Há testes para os principais casos de erro (erros de domínio)

### Testes E2E

- [ ] Existe ao menos um `.e2e.spec.ts` por operação relevante
- [ ] Testes usam `supertest` contra a `app` real
- [ ] `beforeAll` faz `app.ready()` e `afterAll` faz `app.close()`
- [ ] Testes verificam status code e estrutura do body

### Qualidade Geral

- [ ] Sem `console.log` no código de produção
- [ ] Novos erros de domínio registrados no error handler do `app.ts`
- [ ] Se novo modelo Prisma: migration foi criada

## Apresentação do Resultado

Apresente o resultado organizado por categoria, com o status de cada item. Seja direto:

**Se houver itens ❌ reprovados:**
Liste os problemas com clareza e o que precisa ser corrigido. Não prossiga para o PR. Diga ao usuário para corrigir e rodar o QA Check novamente.

**Se houver apenas itens ⚠️ (atenção):**
Explique os pontos de atenção, mas deixe o usuário decidir se quer corrigir antes ou prosseguir com o PR.

**Se tudo ✅ aprovado:**
Parabéns sucinto e siga para a criação do PR.

## Criação do Pull Request

### 1. Monte o rascunho

```
feat([módulo]): [descrição curta do que foi implementado]

## O que foi implementado

[2-3 frases descrevendo o que o módulo faz, da perspectiva do usuário]

## Mudanças técnicas

- Módulo `[nome]` com controller, service e repository
- [Outras mudanças relevantes: migration, shared types, etc.]

## Testes

- Testes unitários: [N] specs cobrindo [operações]
- Testes E2E: [N] specs cobrindo [rotas]

## Como testar

1. [Passo 1 para testar manualmente se quiser]
2. [Passo 2]

Closes #[número da Issue]
```

### 2. Apresente para aprovação

Mostre o rascunho completo e pergunte:

> "Este é o rascunho do PR. Quer ajustar algo antes de criar no GitHub?"

Aguarde confirmação explícita. Não crie o PR sem aprovação.

### 3. Crie o PR no GitHub

Após aprovação, use o GitHub MCP para criar o Pull Request:
- **Repositório:** `fabianoneumann/eco-iguassu`
- **Título:** a primeira linha do rascunho
- **Body:** o conteúdo completo do rascunho
- **Branch base:** `main`
- **Branch compare:** a branch atual do usuário

O `Closes #[N]` no body fará o GitHub fechar a Issue automaticamente quando o PR for mergeado.

### 4. Informe o resultado

Após criar, informe a URL do PR gerado e lembre o usuário de revisar e fazer o merge quando estiver satisfeito.
