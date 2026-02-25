import { ICompany } from "../entities/company"

export interface CompanyFilter {
    limit: number
    start: number
    q?: string
    sortBy?: keyof ICompany
    sortDir?: "ASC" | "DESC"
}

export interface ICompanyRepository {
    findMany(filter: CompanyFilter): Promise<{ total: number; filteredTotal: number; items: ICompany[] }>
    findByUuid(uuid: string): Promise<ICompany | null>
    findByCnpj(cnpj: string): Promise<ICompany | null>
    create(company: ICompany): Promise<ICompany>
    update(uuid: string, data: Partial<ICompany>): Promise<ICompany>
    delete(uuid: string): Promise<void>
}
