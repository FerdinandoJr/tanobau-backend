import { Email } from "core/valueObjects"
import { UserStatus, UserType } from "../valueObjects"
import { ITenant, Tenant } from "modules/tenants/domain/entities/tenant"

export type UserId = number

export interface IUser {
    id: UserId
    uuid: string
    firstName: string
    lastName: string
    email: Email
    password: string
    status: UserStatus
    type: UserType
    createdAt: Date
    tenant: ITenant | null

    generateVerificationCode(): string
    getFullName(): string
}

type UserProps = Omit<IUser, 'generateVerificationCode' | 'getFullName'>

export class User implements IUser {
    id: UserId
    uuid: string
    firstName: string
    lastName: string
    email: Email
    password: string
    status: UserStatus
    type: UserType
    createdAt: Date
    tenant: ITenant | null

    constructor(props: UserProps) {
        this.id = props.id
        this.uuid = props.uuid
        this.firstName = props.firstName
        this.lastName = props.lastName
        this.email = props.email
        this.password = props.password
        this.status = props.status
        this.type = props.type
        this.createdAt = props.createdAt
        this.tenant = props.tenant
    }


    /**
     * Gera um codigo de verificacao de 6 digitos. Ex: "ABC321"
     * @returns string
     */
    public generateVerificationCode(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let out = ""
        for (let i = 0; i < 6; i += 1) {
            out += chars[Math.floor(Math.random() * chars.length)]
        }
        return out
    }

    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`
    }   
}
