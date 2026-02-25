import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { CreateCompanyDTO } from "modules/companies/dto/create-company.dto"
import { CreateUserDTO } from "modules/users/dto/create.user.dto"


export class RegisterUserDTO {

  @ValidateNested()
  @Type(() => CreateUserDTO)
  user!: CreateUserDTO

  @ValidateNested()
  @Type(() => CreateCompanyDTO)
  company!: CreateCompanyDTO

}
