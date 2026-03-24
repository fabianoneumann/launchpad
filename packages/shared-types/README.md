# Interfaces, enums, tipos de API, etc.

Contrato entre apps e backend

// Tipos de resposta da API
export interface UserResponse { ... }
export interface TourResponse { ... }

// Enums compartilhados
export enum UserRole { ADMIN, MEMBER, USER }

// Tipos de paginação, erros, etc.
export interface PaginatedResponse<T> { ... }

Simples, focado, sem dependências. Essa é a decisão certa.