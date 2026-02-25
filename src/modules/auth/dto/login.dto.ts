import { IsEmail, IsString, MinLength } from "class-validator"
import { IUser } from "modules/users/domain/entities/user"
import { UserResponseDTO, UserResponseMapper } from "modules/users/dto/list-users.dto"
import { TokenPair } from "core/security/jwt/jwt.types"
import { CompanyResponseDTO, CompanyResponseMapper } from "modules/companies/dto/list-companies.dto"
import { ICompany } from "modules/companies/domain/entities/company"

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
  token!: string
  refreshToken!: string
  companies!: CompanyResponseDTO[]

  static from(input: {
    user: IUser
    tokenPair: TokenPair,
    companies: ICompany[]
  }): LoginResponseDTO {
    const dto = new LoginResponseDTO()
    dto.user = UserResponseMapper.toDto(input.user)
    dto.token = input.tokenPair.accessToken
    dto.refreshToken = input.tokenPair.refreshToken
    dto.companies = input.companies.map(c => CompanyResponseMapper.toDto(c))
    return dto
  }
}
