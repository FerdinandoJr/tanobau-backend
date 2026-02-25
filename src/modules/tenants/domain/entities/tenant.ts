import { TenantStatus } from "../valueObjects/tenant-status.enum"
import { ICompany } from "modules/companies/domain/entities/company"

export type TenantId = number


export interface ITenant {
    id: TenantId
    uuid: string
    apiVersion: string
    name: string
    status: TenantStatus
    createdAt: Date
    isActive: boolean
    company?: ICompany | null
}

export class Tenant implements ITenant {
    id: TenantId
    uuid: string
    apiVersion: string
    name: string
    status: TenantStatus
    createdAt: Date
    isActive: boolean
    company?: ICompany | null

    constructor(props: ITenant) {
        this.id = props.id
        this.uuid = props.uuid
        this.apiVersion = props.apiVersion
        this.name = props.name
        this.status = props.status
        this.createdAt = props.createdAt
        this.isActive = props.isActive
        this.company = props.company
    }
}