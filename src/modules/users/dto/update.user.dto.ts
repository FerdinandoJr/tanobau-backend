import { Transform } from "class-transformer"
import { IsOptional, IsString, Length,  MinLength } from "class-validator"

import { IUser } from "../domain/entities/user"

import { Email } from "core/valueObjects"


export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @Length(1, 80)
  firstName?: string

  @IsOptional()
  @IsString()
  @Length(1, 80)
  lastName?: string

  @IsOptional()
  @Transform(({ value }) => new Email(value?.trim().toLowerCase()))
  email?: Email
  
  public validate() : Partial<IUser> {
    const data: Partial<IUser> = {}
    
    if (this.firstName !== undefined) data.firstName = this.firstName
    if (this.lastName !== undefined) data.lastName = this.lastName
    if (this.email !== undefined) data.email = this.email

    return data
  }
}