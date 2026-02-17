import { IsUUID } from "class-validator"

export class CreateSchemaDTO {
  @IsUUID()
  code!: string
}
