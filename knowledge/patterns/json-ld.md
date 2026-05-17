# Pattern: JSON-LD em Server Components (Web)

> **Quando usar:** páginas públicas com SEO em apps/web (Next.js 16 + App Router) onde o conteúdo
> é renderizado em Server Components. Não aplicável em Client Components nem em páginas internas
> sem indexação (login, perfil, checkout).

JSON-LD é injetado no Server Component de página via `<script dangerouslySetInnerHTML>`,
reutilizando dados já buscados para o conteúdo — sem fetch extra.

## Técnica

```tsx
// page.tsx (Server Component) — dados já buscados para a página
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',  // ou qualquer schema.org type relevante para o domínio
  name: item.name,
  description: item.description,
  // ... campos do domínio
}

return (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    {/* restante da página */}
  </>
)
```

## Princípios

- **Sem fetch extra** — reutilizar sempre dados já buscados para renderizar a página
- **ISR atualiza o JSON-LD automaticamente** — o schema está no HTML gerado no servidor, não injetado por JS; quando a página revalida, o structured data revalida junto
- Escolher o `@type` adequado ao domínio em [schema.org](https://schema.org)

## Ver também

- [`patterns/server-components.md`](server-components.md) — fetch, cache tags, HydrationBoundary
