import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { TenantModel } from "./tenant"
import { UserTenantModel } from "./user-tenant"
import { CNPJ } from "core/valueObjects"
import { cnpjTransformer } from "database/transformers/cnpj.transformers"


@Entity({ schema: "public", name: "companies", comment: "Tabela de empresas cadastradas no sistema" })
export class CompanyModel {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({ type: "uuid", comment: "Código único da empresa", unique: true })
    uuid!: string

    @Column({ type: "varchar", length: 255, comment: "Razão social da empresa" })
    companyName!: string

    @Column({ type: "varchar", length: 255, nullable: true, comment: "Nome fantasia da empresa" })
    tradeName!: string | null

    @Column({ 
        type: "varchar",
        length: 14,
        unique: true,
        transformer: cnpjTransformer,
        comment: "CNPJ da empresa"
    })
    cnpj!: CNPJ

    @Column({ type: "boolean", default: true, comment: "Indica se a empresa está ativa" })
    isActive!: boolean    

    @CreateDateColumn({ comment: "Data de criação" })
    createdAt!: Date

    @UpdateDateColumn({ comment: "Data de atualização" })
    updatedAt!: Date

    @Column({ type: "integer", comment: "ID do tenant vinculado a esta empresa", unique: true })
    tenantId!: number

    @OneToOne(() => TenantModel, (tenant) => tenant.company)
    @JoinColumn({ name: "tenantId" })
    tenant!: TenantModel

    @OneToMany(() => UserTenantModel, (userTenant) => userTenant.company)
    userTenants!: UserTenantModel[]
}
