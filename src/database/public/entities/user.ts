import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { UserStatus, UserType } from "modules/users/domain/valueObjects"
import { Email } from "core/valueObjects"
import { emailTransformer } from "database/transformers/email.transformers"

import { UserTenantModel } from "./user-tenant"

@Entity({ schema: "public", name: "users", comment: "Tabela de usuários cadastrados no sistema" })
export class UserModel {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({ type: "uuid", comment: "Código único do usuário", unique: true })
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
        default: UserType.COMPANY,
        comment: 'Tipo de conta do usuario',
    })
    type!: UserType

    @Column({ type: "boolean", comment: "Verificação se o usuário está ativo/inativo", default: false })
    isActive!: boolean

    @CreateDateColumn({ comment: "Data de criação" })
    createdAt!: Date

    @UpdateDateColumn({ comment: "Data de atualização" })
    updatedAt!: Date

    @OneToMany(() => UserTenantModel, (userTenant) => userTenant.user)
    userTenants!: UserTenantModel[]
}
