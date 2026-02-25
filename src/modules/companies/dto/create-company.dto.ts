import { IsOptional, IsString, Length } from "class-validator"
import { uuidv7 } from "uuidv7"
import { ICompany, Company } from "../domain/entities/company"
import { CNPJ } from "core/valueObjects"

export class CreateCompanyDTO {

    @IsString()
    @Length(1, 255)
    companyName!: string

    @IsOptional()
    @IsString()
    @Length(1, 255)
    tradeName?: string

    @IsString()
    @Length(14, 14)
    cnpj!: string

    public validate(): ICompany {
        const uuid = uuidv7()

        return new Company({
            id: 0,
            uuid,
            companyName: this.companyName,
            tradeName: this.tradeName ?? null,
            cnpj: new CNPJ(this.cnpj),
            isActive: true,
            tenantId: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
}
