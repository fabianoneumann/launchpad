# ADR 002: Estratégia de i18n — frouxa vs estrita

## Decisão

Entidades de conteúdo principal usam i18n frouxa (locales parciais aceitos).
Entidades de suporte exibidas em qualquer contexto multilingual usam i18n estrita (todos os locales obrigatórios).

## Critério de decisão

**i18n frouxa:** quando o conteúdo é adicionado gradualmente e pode ser publicado com
tradução incompleta sem causar falha de renderização. Resolução de locale faz fallback
para o locale disponível mais próximo.

**i18n estrita:** quando a entidade é renderizada dentro de qualquer página do site
multilingual e uma tradução faltante causaria falha de renderização visível ao usuário.
O custo de exigir todos os locales na criação é baixo para entidades cadastradas com
baixa frequência.

## Implementação

- i18n frouxa: `translations` aceita 1 ou mais locales; resolução com fallback
- i18n estrita: validação no service rejeita criação/atualização se faltar qualquer locale configurado

## Locales configurados

`pt-BR` (padrão), `en`, `es`
