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

export class LoginResponseDTO {
  user!: UserResponseDTO
  token?: string
  refreshToken?: string

  static from(input: {
    user: IUser
    tokenPair?: TokenPair
  }): LoginResponseDTO {
    return {
      user: UserResponseMapper.toListItem(input.user),
      token: input.tokenPair?.accessToken,
      refreshToken: input.tokenPair?.refreshToken
    }
  }
}
