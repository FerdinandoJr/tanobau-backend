import { IsEmail, IsString, Length, MaxLength, MinLength } from "class-validator"
import { IUser } from "modules/users/domain/entities/user"
import { ITenant } from "modules/tenants/domain/entities/tenant"
import { UserResponseDTO, UserResponseMapper } from "modules/users/dto/list-users.dto"
import { TokenPair } from "core/security/jwt/jwt.types"
import { TenantStatus } from "modules/tenants/domain/valueObjects/tenant-status.enum"

export class AuthenticateDTO {
  @IsEmail({}, { message: 'O login deve ser um e-mail válido' })
  @IsString()
  login!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

type CompanyResponseDTO = {
  uuid: string
  tradeName: string
  companyName: string
  cnpj: string
  version: string
  // config: TenantSettingsResponseDTO,
  status: TenantStatus
}

export class LoginResponseDTO {
  user!: UserResponseDTO
  token?: string
  refreshToken?: string
  companies!: CompanyResponseDTO[]

  static from(input: {
    user: IUser
    tokenPair?: TokenPair
    tenants: ITenant[]
  }): LoginResponseDTO {
    return {
      user: UserResponseMapper.toListItem(input.user),
      token: input.tokenPair?.accessToken,
      refreshToken: input.tokenPair?.refreshToken,
      companies: input.tenants.map(t => ({
        uuid: t.uuid,
        tradeName: t.tradeName,
        companyName: t.companyName,
        cnpj: t.cnpj.value,
        version: t.apiVersion,
        status: t.status,
        // config: TenantSettingsResponseMapper.toListItem(t.settings),
      }))
    }
  }

  static fromCreateTenant(input: {
    user: IUser
    token: string
    tenants: ITenant[]
  }): LoginResponseDTO {
    return {
      user: UserResponseMapper.toListItem(input.user),
      token: input.token,
      companies: input.tenants.map(t => ({
        uuid: t.uuid,
        tradeName: t.tradeName,
        companyName: t.companyName,
        cnpj: t.cnpj.value,
        version: t.apiVersion,
        status: t.status,
        // config: TenantSettingsResponseMapper.toListItem(t.settings)
      }))
    }
  }
}
