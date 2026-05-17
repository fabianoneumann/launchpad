# Commands: Known Issues

Registro de armadilhas encontradas em comandos do projeto.
O agente adiciona entradas aqui quando encontrar erros recorrentes ou comportamentos inesperados.

## Formato de entrada

```
## [comando com problema]
**Sintoma:** o que acontece de errado
**Causa:** por que acontece
**Solução:** o que fazer para corrigir
```

---

## .claude/settings.json — variáveis `$` no campo `command` corrompem o script (Windows)
**Sintoma:** PostToolUse hook error "No linha:1 caractere:X" ao usar `$root`, `$null` etc. inline  
**Causa:** O hook roda dentro de um processo PowerShell externo que expande `$var` antes de
passar o comando ao processo filho; `2>$null` vira `2>)` (inválido) quando `$null` é expandido  
**Solução:** Não declarar variáveis `$` inline no campo `command`; usar `$CLAUDE_PROJECT_DIR`
(substituído pelo Claude Code antes do shell) — ver `knowledge/tooling/claude-code.md`

---

## .claude/settings.json — caminho relativo ao script falha quando CWD ≠ raiz do projeto
**Sintoma:** hook error "argumento `.claude/script.ps1` para -File não existe"  
**Causa:** O CWD do hook é o working directory ativo do Claude Code (ex: `apps/web`),
não a raiz do repositório; caminhos relativos são resolvidos a partir daí  
**Solução:** Usar `$CLAUDE_PROJECT_DIR` no caminho: `powershell -NoProfile -File "$CLAUDE_PROJECT_DIR/.claude/script.ps1"`  
— ver `knowledge/tooling/claude-code.md`

---

## `lucide-react@1.7.0` — ícones de marcas removidos (Facebook, Instagram, Twitter…)
**Sintoma:** `Export Facebook doesn't exist in target module` (e similares) ao importar ícones de redes sociais  
**Causa:** `lucide-react` removeu ícones de marcas a partir de versões recentes para focar em ícones genéricos  
**Solução:** Usar SVG inline para ícones de marca. Paths oficiais disponíveis nos sites das redes ou via Simple Icons.  
Exemplo para Footer do web:
```tsx
function InstagramIcon({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} ...>...</svg>
}
```

---

## `next/image` — warning "either width or height modified, but not the other"
**Sintoma:** Warning em runtime no browser; aparece em testes E2E Playwright  
**Causa:** `next/image` compara `img.height` (renderizado) com `getAttribute('height')` (prop).
Quando o CSS coincide com o prop (ex: `height={40}` + CSS `40px`), `heightModified = false`.
Se `width: auto` fizer o `img.width` diferir do prop width, `widthModified = true`.
Condição `!heightModified && widthModified` → warning.  
**Solução:** Usar as **dimensões naturais do arquivo** como props `width`/`height` — garantem que
CSS height (display) e prop height (natural) sempre diferem, tornando `heightModified = true`:
```tsx
// logo.png tem dimensões naturais 1602×661
<Image src="/logo.png" width={1602} height={661} style={{ height: 40, width: 'auto' }} />
```
Para obter dimensões naturais de um PNG:
```js
node -e "const b=require('fs').readFileSync('public/logo.png'); console.log(b.readUInt32BE(16), b.readUInt32BE(20))"
```

---

## `prisma migrate dev` — falha em ambiente não-interativo (Claude Code bash tool)
**Sintoma:** `Error: Prisma Migrate has detected that the environment is non-interactive, which is not supported.`  
**Causa:** O bash tool do Claude Code não aloca TTY; o Prisma recusa `migrate dev` (e também `migrate dev --create-only`) em ambientes sem terminal interativo. Não tem relação com a API estar parada — o Prisma conecta diretamente no banco.  
**Solução:** Criar o arquivo SQL da migration manualmente, seguindo o padrão das migrations existentes em `prisma/migrations/`, e aplicar com `prisma migrate deploy` (não-interativo). Após aplicar, rodar `pnpm --filter api exec prisma generate` para regenerar o client.

---

## `vi.stubGlobal('location', { href: '' })` quebra MSW no Vitest (jsdom)
**Sintoma:** `TypeError: Invalid URL` em todos os testes que fazem requests via Axios + MSW,
mesmo quando a URL passada ao Axios é absoluta (`http://localhost:3333/...`)  
**Causa:** O interceptor interno do MSW chama `new URL(url, window.location.href)`. Em Node.js,
`new URL('http://...', '')` lança Invalid URL mesmo com URL absoluta na posição base — a base
vazia é inválida independentemente do primeiro argumento  
**Solução:** Usar `vi.stubGlobal('location', { href: 'http://localhost/' })` — URL base válida.
Com objeto simples, `window.location.href = '/login'` funciona como atribuição comum e pode
ser verificado com `expect(window.location.href).toBe('/login')` após o teste
