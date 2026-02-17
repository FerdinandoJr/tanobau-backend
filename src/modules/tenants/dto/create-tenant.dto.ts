import { Transform, Type } from "class-transformer"
import { IsNotEmpty, IsString, Length } from "class-validator"
import { CNPJ } from "modules/companies/domain/valueObjects/cnpj"
import { ITenant, Tenant } from "../domain/entities/tenant"
import { uuidv7 } from "uuidv7"
import { TenantStatus } from "../domain/valueObjects/tenant-status.enum"
import { TenantSettings } from "modules/tenantSettings/domain/entities/tenant-settings"
import { env } from "process"


export class CreateTenantDTO {

  @IsNotEmpty({ message: "O CNPJ é obrigatório" })
  @Transform(({ value }) => new CNPJ(value))
  cnpj!: CNPJ

  @IsString()
  @Length(1, 150)
  companyName!: string

  @IsString()
  @Length(1, 255)
  tradeName!: string

  public validate(): ITenant {
    const uuid = uuidv7()
    return new Tenant({
      id: 0,
      uuid: uuid,
      apiVersion: env.API_VERSION || "v1",
      name: this.companyName,
      cnpj: this.cnpj,
      companyName: this.companyName,
      tradeName: this.tradeName,
      status: TenantStatus.CREATE,
      settings: TenantSettings.create(),
      createdAt: new Date(),
      isActive: true
    })
  }
}