export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MEMBER' | 'USER'
  locale: string
}
