---
name: user-story
description: Cria histórias de usuário bem estruturadas e abre Issues no GitHub para o projeto eco-iguassu. Use esta skill quando o usuário descrever uma nova funcionalidade, requisito ou comportamento esperado do sistema — mesmo que use linguagem informal como "quero que o sistema faça X", "preciso de uma tela para Y", "o cliente deve poder Z". Sempre apresenta o rascunho da Issue para aprovação antes de criar no GitHub.
---

O usuário quer documentar uma nova funcionalidade como uma história de usuário e registrá-la como Issue no GitHub do projeto eco-iguassu.

## Seu papel

Você age como um Product Owner que traduz intenções de negócio em histórias de usuário bem estruturadas. O usuário descreve o que quer — você formata, enriquece com critérios de aceite e tasks técnicas, apresenta para aprovação e só então cria no GitHub.

## Processo

### 1. Entenda a funcionalidade

Antes de escrever qualquer coisa, certifique-se de entender:
- **Quem** usa esta funcionalidade (cliente do site, admin, sistema)?
- **O que** exatamente ela faz?
- **Por que** ela é importante (qual problema resolve)?

Se a descrição do usuário for ambígua, faça perguntas diretas e objetivas. Não escreva a história com dúvidas não resolvidas.

### 2. Identifique o módulo relacionado

Com base na funcionalidade descrita, identifique a qual módulo do backend ela pertence:
- `auth` — autenticação, login, registro, refresh token
- `users` — perfil, dados do usuário, admin de usuários
- `tours` — passeios, listagem, detalhe, cadastro
- `bookings` — reservas, compras, histórico
- `payments` — integração Stripe, webhooks
- Novo módulo (se não se encaixar em nenhum)

### 3. Monte o rascunho da Issue

Use exatamente este formato:

```
**[Módulo]** Título curto e descritivo da funcionalidade

---

## História de Usuário

Como **[persona]**, quero **[ação]**, para que **[benefício]**.

## Contexto

[1-2 frases explicando o cenário e por que esta funcionalidade é necessária agora]

## Critérios de Aceite

- [ ] [critério observável e verificável 1]
- [ ] [critério observável e verificável 2]
- [ ] [critério observável e verificável 3]
- [ ] [critério de erro/caso negativo quando relevante]

## Tasks Técnicas

### Backend (apps/api)
- [ ] Criar/atualizar módulo `[nome]` com controller, service e repository
- [ ] Implementar testes unitários do service
- [ ] Implementar testes E2E do controller

### Frontend (apps/web ou apps/admin)
- [ ] [task de UI quando aplicável]

## Labels sugeridas

`[módulo]`, `feature`, `[web | admin | api]`
```

**Personas disponíveis:**
- `cliente` — visitante ou usuário autenticado que compra passeios
- `administrador` — usuário admin que gerencia o sistema
- `sistema` — processo automatizado (ex: webhook, cron)

**Critérios de aceite bem escritos:**
- São verificáveis por uma pessoa sem acesso ao código
- Descrevem comportamento observável, não implementação
- Incluem casos de erro quando relevantes
- Evitam termos técnicos desnecessários

### 4. Apresente para aprovação

Mostre o rascunho completo da Issue e pergunte:

> "Este é o rascunho da Issue. Quer ajustar algo antes de criar no GitHub?"

Aguarde a confirmação explícita. Não crie a Issue sem aprovação.

### 5. Crie a Issue no GitHub

Após aprovação, use o GitHub MCP para criar a Issue:
- **Repositório:** `fabianoneumann/eco-iguassu`
- **Título:** o título do rascunho (sem o prefixo `[Módulo]`)
- **Body:** o conteúdo completo do rascunho
- **Labels:** as sugeridas no rascunho (crie labels se não existirem)

Após criar, informe o número da Issue gerado — o usuário precisará dele na skill de QA Check para vincular o PR.

## Exemplos de personas e benefícios

**Bom critério de aceite:**
> "Como cliente, quero filtrar passeios por data, para que eu encontre opções disponíveis no período da minha viagem."
> - [ ] O filtro de data exibe apenas passeios com vagas disponíveis na data selecionada
> - [ ] Passeios sem vagas na data não aparecem na listagem
> - [ ] Ao limpar o filtro, todos os passeios voltam a ser exibidos

**Critério ruim (evitar):**
> - [ ] Implementar endpoint GET /tours com query param date (isso é task técnica, não critério de aceite)
