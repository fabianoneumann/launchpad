# Tooling: Claude Code

## Hooks — como funcionam no Windows

Claude Code executa hooks PostToolUse dentro de um processo PowerShell externo.
O campo `command` do hook é interpretado por esse processo PowerShell antes de chegar
ao processo filho que o comando invoca.

**Consequência prática:** variáveis com `$` (ex: `$root`, `$null`) declaradas inline no
campo `command` são expandidas pelo PowerShell externo, chegando vazias ou corrompidas
ao processo destino. Isso se manifesta como erro de parse do PowerShell (ex: `2>$null`
vira `2>)`, inválido).

**Variável segura:** `$CLAUDE_PROJECT_DIR` é substituída pelo próprio Claude Code antes
de passar o comando ao shell — não sofre expansão prematura. É o único jeito portável
de referenciar a raiz do projeto dentro de um hook.

## CWD dos hooks

O working directory quando um hook dispara é o working context ativo do Claude Code —
não necessariamente a raiz do repositório. Se o Claude Code foi aberto com `apps/web`
como diretório primário, o hook roda de `apps/web`. Caminhos relativos como
`.claude/script.ps1` falham nesse cenário.

## Padrão correto para hooks com script externo

```json
{
  "type": "command",
  "command": "powershell -NoProfile -File \"$CLAUDE_PROJECT_DIR/.claude/script.ps1\"",
  "timeout": 30,
  "statusMessage": "Mensagem de status..."
}
```

- Usar `-File` (não `-Command`) — mais simples, herda stdin corretamente
- Usar `$CLAUDE_PROJECT_DIR` — portável entre máquinas e diretórios de trabalho
- Não declarar variáveis `$` inline no campo `command`

## Configuração atual deste projeto

**`.claude/settings.json`** — hook PostToolUse que roda Prettier após Write/Edit:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "powershell -NoProfile -File \"$CLAUDE_PROJECT_DIR/.claude/format-hook.ps1\"",
            "timeout": 30,
            "statusMessage": "Formatando com Prettier..."
          }
        ]
      }
    ]
  }
}
```

**`.claude/format-hook.ps1`** — lê o JSON de stdin, verifica se o arquivo editado está
dentro de `apps/*/src/`, e chama `pnpm exec prettier --write` se sim:

```powershell
$j = [Console]::In.ReadToEnd() | ConvertFrom-Json
$f = $j.tool_input.file_path
if ($f -and ($f -match 'apps[/\\][^/\\]+[/\\]src[/\\]')) {
    pnpm exec prettier --write $f 2>$null
}
exit 0
```

Arquivos fora de `apps/*/src/` (ex: `knowledge/`, `.claude/`) não são formatados.

**Limitação de plataforma:** o hook é PowerShell — não executa em Mac/Linux. Se o projeto
passar a ter colaboradores nessas plataformas, criar um `format-hook.sh` equivalente e
condicionar a chamada no `settings.json` por OS, ou usar uma ferramenta cross-platform
(ex: `npx prettier --write` via Node diretamente no campo `command`).

## Variáveis disponíveis em hooks

| Variável | Descrição |
|---|---|
| `$CLAUDE_PROJECT_DIR` | Raiz do projeto (substituída pelo Claude Code antes do shell) |
| `cwd` (via stdin JSON) | Diretório ativo no momento do evento |
