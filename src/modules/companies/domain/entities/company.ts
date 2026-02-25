import { CNPJ } from "core/valueObjects"

export type CompanyId = number

export interface ICompany {
    id: CompanyId
    uuid: string
    companyName: string
    tradeName: string | null
    cnpj: CNPJ
    isActive: boolean
    tenantId: number
    createdAt: Date
    updatedAt: Date
}

type CompanyProps = ICompany

export class Company implements ICompany {
    id: CompanyId
    uuid: string
    companyName: string
    tradeName: string | null
    cnpj: CNPJ
    isActive: boolean
    tenantId: number
    createdAt: Date
    updatedAt: Date

    constructor(props: CompanyProps) {
        this.id = props.id
        this.uuid = props.uuid
        this.companyName = props.companyName
        this.tradeName = props.tradeName
        this.cnpj = props.cnpj
        this.isActive = props.isActive
        this.tenantId = props.tenantId
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
    }
}
