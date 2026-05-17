# Pattern: shadcn/ui — Primitivos por App

## Regra de isolamento

As duas apps usam primitivos de base diferentes e **não são intercambiáveis**:

| App | shadcn style | Primitivo | Pacote |
|---|---|---|---|
| `apps/admin` | `new-york` | Radix UI | `radix-ui` |
| `apps/web` | `base-nova` | Base UI | `@base-ui/react` |

**Nunca importar o primitivo errado para o app em que você está trabalhando.**

## Por que diferem

O admin foi instalado com shadcn CLI 4.1.2 antes do estilo `base-nova` existir. O web foi instalado com 4.6.0, que adotou `base-nova` (Base UI) como padrão. A migração do admin para Base UI exigiria regenerar todos os 24 componentes instalados — não foi feita intencionalmente.

## Padrão de import por app

**Admin (`apps/admin`) — importar de `radix-ui`:**
```tsx
import { Slot } from 'radix-ui'
import { Dialog as DialogPrimitive } from 'radix-ui'
```

**Web (`apps/web`) — importar de `@base-ui/react`:**
```tsx
import { Button as ButtonPrimitive } from '@base-ui/react/button'
```

## Adicionar componentes via CLI

```bash
# Admin
pnpm dlx shadcn@latest add <componente> --cwd apps/admin

# Web
pnpm dlx shadcn@latest add <componente> --cwd apps/web
```

O CLI lê o `components.json` de cada app e gera o componente com o primitivo correto automaticamente.

## API do `@base-ui/react` Menu (web) — diferenças do Radix

O `dropdown-menu` gerado pelo CLI no `apps/web` usa `@base-ui/react/menu` e tem comportamento diferente do equivalente Radix (admin):

| Aspecto | `apps/web` (@base-ui) | `apps/admin` (Radix) |
|---|---|---|
| `DropdownMenuTrigger` | Renderiza como `<button>` nativo — **não tem `asChild`** | Suporta `asChild` |
| `DropdownMenuItem` como link | Usar `onClick={() => router.push('/rota')}` | Suporta `asChild` com `<Link>` |
| `className` no trigger | Passado direto — sem wrapper extra | Pode precisar de `asChild` |

```tsx
// web — correto
<DropdownMenuTrigger className="flex items-center gap-2">
  Trigger
</DropdownMenuTrigger>

<DropdownMenuItem onClick={() => router.push('/account/profile')}>
  Minha conta
</DropdownMenuItem>
```

Importar de `@/components/ui/dropdown-menu` — nunca do primitivo diretamente.

## dark mode

- **Admin:** suporta dark mode (`next-themes`, bloco `.dark {}` em `src/index.css`)
- **Web:** light-mode only — sem `.dark {}` no CSS, sem `next-themes`

**Atenção:** o componente `sonner.tsx` gerado pelo CLI importa `useTheme` de `next-themes` por padrão.
No web, remover essa importação e hardcodar `theme="light"` — `next-themes` não está instalado.

## Bandeiras de locale (web)

Ícones de bandeiras para o `LocaleSwitcher` usam `country-flag-icons/react/3x2` — componentes React SVG inline, tree-shakable.

```tsx
import { BR, US, ES } from 'country-flag-icons/react/3x2'
// <BR title="Português" className="h-4 w-auto rounded-sm" />
```

**Não usar** emojis de bandeiras (🇧🇷) — proibido pelo Design System ("sem emoji em qualquer elemento de UI").
