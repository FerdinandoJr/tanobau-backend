import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { CreateUserDTO } from "modules/users/dto/create.user.dto"


export class RegisterUserDTO {

  @ValidateNested()
  @Type(() => CreateUserDTO)
  user!: CreateUserDTO

}
