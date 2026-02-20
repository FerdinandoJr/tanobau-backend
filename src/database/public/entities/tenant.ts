import { cnpjTransformer } from "database/transformers/cnpj.transformers"
import { TenantStatus } from "modules/tenants/domain/valueObjects/tenant-status.enum"
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { UserModel } from "./user"

@Entity({ schema: "public", name: "tenants", comment: "Tabela de tenants, representa um schema que utiliza o sistema" })
export class TenantModel {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({ type: "uuid", comment: "Código único para o tenant", unique: true })
    uuid!: string

    @Column({
        type: "varchar",
        comment: "Nome único para o tenant (Schema Name)",
        unique: true
    })
    name!: string

    @Column({ type: "varchar", comment: "Versão da api para esse tenant" })
    apiVersion!: string

    @Column({
        type: "enum",
        comment: "Verificação se o tenant foi criado ou não",
        enum: TenantStatus,
        default: TenantStatus.NOT_CREATE
    })
    status!: TenantStatus

    @CreateDateColumn({ comment: "Data de criação" })
    createdAt!: Date

    @Column({ type: "boolean", comment: "Verificação se o tenant está ativo/inativo", default: false })
    isActive!: boolean

    @OneToOne(() => UserModel, (user) => user.tenant)
    user!: UserModel
}
