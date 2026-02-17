import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { CreateTenantDTO } from "modules/tenants/dto/create-tenant.dto"
import { CreateUserDTO } from "modules/users/dto/create.user.dto"


export class RegisterUserDTO {

  @ValidateNested()
  @Type(() => CreateUserDTO)
  user!: CreateUserDTO

  @ValidateNested()
  @Type(() => CreateTenantDTO)
  tenant!: CreateTenantDTO

}
