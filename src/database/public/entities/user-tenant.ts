import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm"
import { UserModel } from "./user"
import { CompanyModel } from "./company"

@Entity({ schema: "public", name: "user_tenants", comment: "Tabela de acesso de usuários às empresas (N:N)" })
@Unique(["userId", "companyId"])
export class UserTenantModel {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({ type: "integer", comment: "ID do usuário" })
    userId!: number

    @Column({ type: "integer", comment: "ID da empresa" })
    companyId!: number

    @Column({ type: "boolean", default: true, comment: "Indica se o acesso está ativo" })
    isActive!: boolean

    @CreateDateColumn({ comment: "Data de criação do vínculo" })
    createdAt!: Date

    @ManyToOne(() => UserModel, (user) => user.userTenants, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: UserModel

    @ManyToOne(() => CompanyModel, (company) => company.userTenants, { onDelete: "CASCADE" })
    @JoinColumn({ name: "companyId" })
    company!: CompanyModel
}
