import { IsBoolean, IsOptional, IsString, Length } from "class-validator"
import { ICompany } from "../domain/entities/company"
import { CNPJ } from "core/valueObjects"

export class UpdateCompanyDTO {

    @IsOptional()
    @IsString()
    @Length(1, 255)
    companyName?: string

    @IsOptional()
    @IsString()
    @Length(1, 255)
    tradeName?: string

    @IsOptional()
    @IsString()
    @Length(14, 14)
    cnpj?: string

    @IsOptional()
    @IsBoolean()
    isActive?: boolean

    public validate(): Partial<ICompany> {
        const data: Partial<ICompany> = {}

        if (this.companyName !== undefined) data.companyName = this.companyName
        if (this.tradeName !== undefined) data.tradeName = this.tradeName
        if (this.cnpj !== undefined) data.cnpj = new CNPJ(this.cnpj)
        if (this.isActive !== undefined) data.isActive = this.isActive

        return data
    }
}
