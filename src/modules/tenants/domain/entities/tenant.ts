import { CNPJ } from "core/valueObjects"
import { TenantStatus } from "../valueObjects/tenant-status.enum"

export type TenantId = number


export interface ITenant {
    id: TenantId
    uuid: string
    apiVersion: string
    name: string
    cnpj: CNPJ
    companyName: string
    tradeName: string
    status: TenantStatus
    createdAt: Date
    isActive: boolean
}

export class Tenant implements ITenant {
    id: TenantId
    uuid: string
    apiVersion: string
    name: string
    cnpj: CNPJ
    companyName: string
    tradeName: string
    status: TenantStatus
    createdAt: Date
    isActive: boolean

    constructor(props: ITenant) {
        // todo: fazer validações
        this.id = props.id
        this.uuid = props.uuid
        this.apiVersion = props.apiVersion
        this.name = props.name
        this.cnpj = props.cnpj
        this.companyName = props.companyName
        this.tradeName = props.tradeName
        this.status = props.status
        this.createdAt = props.createdAt
        this.isActive = props.isActive
    }
}