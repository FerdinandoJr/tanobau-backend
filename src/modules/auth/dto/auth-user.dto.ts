import { IUser } from "modules/users/domain/entities/user"
import { UserType } from "modules/users/domain/valueObjects"

export class AuthUserDTO {
  id!: number
  code!: string
  firstName!: string
  lastName!: string
  email!: string
  status!: string
  type!: UserType
  createdAt?: Date

  static from(user: IUser): AuthUserDTO {
    const emailValue = user.email.toString()
    return {
      id: user.id,
      code: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: emailValue,
      status: user.status,
      type: user.type ?? UserType.ACCOUNTANT,
      createdAt: user.createdAt
    }
  }
}
