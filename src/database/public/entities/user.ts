import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { UserStatus, UserType } from "modules/users/domain/valueObjects"
import { Email } from "core/valueObjects"
import { emailTransformer } from "database/transformers/email.transformers"
import { TenantModel } from "./tenant"

@Entity({ schema: "public", name: "users" })
export class UserModel {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({
        type: "uuid",
        comment: "Código unico do usuário",
        unique: true
    })
    uuid!: string

    @Column({ comment: "Primeiro nome do usuário" })
    firstName!: string

    @Column({ comment: "Sobrenome do usuário" })
    lastName!: string

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        transformer: emailTransformer,
        comment: 'E-mail único do usuário',
    })
    email!: Email

    @Column({ comment: "Senha criptografada do usuário" })
    password!: string

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE,
        comment: 'Status do usuário',
    })
    status!: UserStatus

    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.USER,
        comment: 'Tipo de conta do usuario',
    })
    type!: UserType

    @CreateDateColumn({ comment: "Data de criação" })
    createdAt!: Date

    @Column({ type: "boolean", comment: "Verificação se o usuário está ativo/inativo", default: false })
    isActive!: boolean

    @Column({ type: "integer", comment: "Código único do tenant" })
    tenantId!: number

    @OneToOne(() => TenantModel, (tenant) => tenant.user)
    @JoinColumn({ name: "tenantId" })
    tenant!: TenantModel
}   
