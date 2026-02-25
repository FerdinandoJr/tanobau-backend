import { ICompany } from "../domain/entities/company"

export type CompanyResponseDTO = {
    uuid: string
    companyName: string
    tradeName: string | null
    cnpj: string
    isActive: boolean
    tenantId: number
    createdAt: Date
    updatedAt: Date
}

export type CompanyListResponseDTO = {
    total: number
    filteredTotal: number
    items: CompanyResponseDTO[]
}

export const CompanyResponseMapper = {
    toDto(c: ICompany): CompanyResponseDTO {
        return {
            uuid: c.uuid,
            companyName: c.companyName,
            tradeName: c.tradeName,
            cnpj: c.cnpj.value,
            isActive: c.isActive,
            tenantId: c.tenantId,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        }
    }
}
