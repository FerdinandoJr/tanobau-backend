// Payload que vai dentro dos tokens
export interface JwtPayload {
  sub: string
  tid: string,
  status?: 'not_create' | null
}

export interface JwtPayloadCreateTenant {
  sub: string       // ID de quem está criando (ex: admin)
  tid: string       // O ID do novo Tenant que será criado
  type: 'create_tenant_token' // Um tipo fixo para validação no Guard
}


// O que retornamos ao logar/renovar
export interface TokenPair {
  accessToken: string
  refreshToken: string
}
