export type User = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MEMBER' | 'USER'
  locale: string
  validated_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}
