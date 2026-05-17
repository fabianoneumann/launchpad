# Pattern: Storage Provider

## Interface

```ts
// src/lib/storage/storage-provider.ts
export interface StorageProvider {
  upload(key: string, body: Buffer, contentType: string): Promise<string>
  delete(key: string): Promise<void>
}
```

`upload` retorna a URL pública do arquivo. `delete` recebe a key (não a URL).

## Implementações

| Classe | Arquivo | Quando usar |
|---|---|---|
| `R2StorageProvider` | `src/lib/storage/r2-storage-provider.ts` | Produção (Cloudflare R2) |
| `FakeStorageProvider` | `src/lib/storage/fake-storage-provider.ts` | Testes unitários |

O `FakeStorageProvider` registra operações em arrays públicos para assertions:

```ts
const storageProvider = new FakeStorageProvider()
await service.execute({ entityId, fileBuffer, mimetype: 'image/jpeg' })

expect(storageProvider.uploads).toHaveLength(1)
expect(storageProvider.uploads[0].key).toMatch(/^entity-name\//)
expect(storageProvider.deletions).toHaveLength(0)
```

## R2 (produção)

Usa `@aws-sdk/client-s3` com endpoint customizado do Cloudflare:

```ts
new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
})
```

Variáveis obrigatórias em produção: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
`R2_BUCKET_NAME`, `R2_PUBLIC_URL`. Em dev são opcionais — mas uploads falharão se não configuradas.

## Convenção de chaves (keys)

```
{entity-name}/{entityId}/{uuid}.{ext}
```

Exemplo: `images/abc-123/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg`

Guardar a `storage_key` no banco (não a URL) para poder deletar depois.

## Upload de arquivos (implementação de referência)

**Limites e validação (controller):**
- Tamanho máximo por arquivo: definir por domínio no controller
- O plugin multipart em `app.ts` tem limite global de 5 MB — o controller pode **redefinir** para um limite maior se necessário
- MIME types aceitos: validar no controller antes de acumular em Buffer

**Fluxo no controller:**
```ts
// controller lê multipart via request.parts() (streaming)
// validar MIME e tamanho antes de acumular em Buffer
```

**Fluxo no service:**
```ts
const key = `{entity-name}/${entityId}/${randomUUID()}.${ext}`
const url = await storageProvider.upload(key, fileBuffer, mimetype)
```
