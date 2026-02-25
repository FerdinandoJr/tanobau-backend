import { IsEmail, IsString, Length, MinLength } from "class-validator"
import { uuidv7 } from "uuidv7"
import { IUser, User } from "../domain/entities/user"
import { Email } from "core/valueObjects"
import { UserStatus, UserType } from "../domain/valueObjects"

export class CreateUserDTO {

  @IsString()
  @Length(1, 80)
  firstName!: string

  @IsString()
  @Length(1, 80)
  lastName!: string

  @Length(1, 80)
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  public validate(): IUser {
    const uuid = uuidv7()

    return new User({
      id: 0,
      uuid,
      firstName: this.firstName,
      lastName: this.lastName,
      email: new Email(this.email),
      password: this.password,
      status: UserStatus.ACTIVE,
      type: UserType.ACCOUNTANT,
      createdAt: new Date(),
      companies: []
    })
  }
}
