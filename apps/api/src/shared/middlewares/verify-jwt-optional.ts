import type { FastifyRequest, FastifyReply } from 'fastify'

export async function verifyJWTOptional(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    // sem token ou token inválido — requisição prossegue sem request.user
    return
  }

  // Token com assinatura válida: verificar token_version para suportar revogação (logout)
  const user = await request.server.usersRepository.findById(request.user.sub)
  if (!user || user.token_version !== request.user.tokenVersion) {
    // Token revogado — trata como não autenticado, sem retornar erro
    ;(request as any).user = undefined
  }
}
