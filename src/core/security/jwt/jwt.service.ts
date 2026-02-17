import { BadRequestException, Injectable } from '@nestjs/common'
import jwt, { JwtPayload as LibJwtPayload, SignOptions } from 'jsonwebtoken'

import { JwtPayload, JwtPayloadCreateTenant, TokenPair } from './jwt.types'
import { IUser } from 'modules/users/domain/entities/user'
import { ITenant } from 'modules/tenants/domain/entities/tenant'

@Injectable()
export class AppJwtService {
  private readonly accessSecret: string
  private readonly refreshSecret: string
  private readonly createTenantSecret: string
  private readonly accessTtl: SignOptions["expiresIn"]
  private readonly refreshTtl: SignOptions["expiresIn"]
  private readonly createTenantTtl: SignOptions["expiresIn"]

  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || ''
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || this.accessSecret
    this.createTenantSecret = process.env.JWT_CREATE_TENANT_SECRET || this.accessSecret
    this.accessTtl = (process.env.JWT_ACCESS_TTL || '7d') as SignOptions["expiresIn"]
    this.refreshTtl = (process.env.JWT_REFRESH_TTL || '7d') as SignOptions["expiresIn"]
    this.createTenantTtl = (process.env.JWT_CREATE_TENANT_TTL || '10m') as SignOptions["expiresIn"]
  }

  // sign
  async signAccessToken(payload: JwtPayload): Promise<string> {
    return jwt.sign(payload, this.accessSecret, { expiresIn: this.accessTtl })
  }

  async signCreateTenantToken(payload: JwtPayloadCreateTenant): Promise<string> {
    return jwt.sign(payload, this.createTenantSecret, { expiresIn: this.createTenantTtl })
  }

  async signRefreshToken(payload: JwtPayload): Promise<string> {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshTtl })
  }

  async signTokenPair(payload: JwtPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ])
    return { accessToken, refreshToken }
  }

  // verify
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    const payload = jwt.verify(token, this.accessSecret)
    if (typeof payload === 'string') {
      throw new BadRequestException('Invalid token payload')
    }
    const cast = payload
    return {
      ...cast,
      sub: String(cast.sub),
    } as JwtPayload
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const payload = jwt.verify(token, this.refreshSecret)
    if (typeof payload === 'string') {
      throw new BadRequestException('Invalid token payload')
    }
    const cast = payload
    return {
      ...cast,
      sub: String(cast.sub),
    } as JwtPayload
  }

  async verifyCreateTenantToken(token: string): Promise<JwtPayloadCreateTenant> {
    const payload = jwt.verify(token, this.createTenantSecret)
    if (typeof payload === 'string') {
      throw new BadRequestException('Invalid token payload')
    }
    const cast = payload
    return {
      ...cast,
      sub: String(cast.sub),
    } as JwtPayloadCreateTenant
  }

  // create
  createCreateTenantToken(user: IUser, tenant: ITenant): JwtPayloadCreateTenant {
    return {
      sub: user.uuid,
      tid: tenant.uuid,
      type: 'create_tenant_token',
    }
  }

  createJwtPayload(user: IUser, tenant: ITenant): JwtPayload {
    return {
      sub: user.uuid,
      tid: tenant.name
    }
  }
}
