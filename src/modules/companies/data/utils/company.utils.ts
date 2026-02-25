import { CompanyModel } from "database/public/entities/company"
import { Company, ICompany } from "modules/companies/domain/entities/company"

export type CompanySortBy = typeof CompanyUtils.SORTABLE_FIELDS[number]

export class CompanyUtils {

    static readonly SORTABLE_FIELDS: readonly (keyof ICompany)[] = [
        "id",
        "companyName",
        "cnpj",
        "createdAt",
    ] as const

    static readonly DEFAULT_SORT: keyof ICompany = "id"

    static toDomain(model: CompanyModel): ICompany {
        return new Company({
            id: model.id,
            uuid: model.uuid,
            companyName: model.companyName,
            tradeName: model.tradeName,
            cnpj: model.cnpj,
            isActive: model.isActive,
            tenantId: model.tenantId,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        })
    }

    static toModel(company: Partial<ICompany>): Partial<CompanyModel> {
        const model: Partial<CompanyModel> = {}

        if (company.id !== undefined) model.id = company.id
        if (company.uuid !== undefined) model.uuid = company.uuid
        if (company.companyName !== undefined) model.companyName = company.companyName
        if (company.tradeName !== undefined) model.tradeName = company.tradeName
        if (company.cnpj !== undefined) model.cnpj = company.cnpj
        if (company.isActive !== undefined) model.isActive = company.isActive
        if (company.tenantId !== undefined) model.tenantId = company.tenantId
        if (company.createdAt !== undefined) model.createdAt = company.createdAt
        if (company.updatedAt !== undefined) model.updatedAt = company.updatedAt

        return model
    }
}
