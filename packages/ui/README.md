# Tokens CSS + Tailwind config base

Consistência sem acoplamento

packages/ui/
  ├── tokens.css          # CSS custom properties (cores, tipografia, espaçamentos)
  ├── tailwind.config.ts  # Config base com os tokens
  └── globals.css         # Reset, base styles

Cada app instala o shadcn/ui de forma independente e consome os tokens do pacote compartilhado. Resultado:

  - Consistência visual (mesma paleta, mesma tipografia)
  - Sem acoplamento (cada app tem seus próprios componentes)
  - Admin e web podem evoluir sem impactar um ao outro