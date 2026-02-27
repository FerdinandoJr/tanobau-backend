import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from "typeorm"
import { SefazConfigModel } from "./sefaz-config"
import { cnpjTransformer } from "database/transformers/cnpj.transformers"
import { CNPJ } from "core/valueObjects"
import { Ambiente } from "core/valueObjects/ambiente"


@Entity({ name: "certificados", comment: "Tabela de certificados" })
export class CertificadoModel {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({ type: "uuid", comment: "Código único para o tenant", unique: true })
    uuid!: string

    @Column({ type: "bytea", comment: "Arquivo binário do certificado" })
    binaryFile!: Buffer

    @Column({ type: "text", comment: "Senha criptografada (AES) do certificado" })
    passwordEncrypted!: string

    @Column({
        type: "varchar",
        length: 14,
        transformer: cnpjTransformer,
        comment: "CNPJ da empresa"
    })
    cnpj!: CNPJ

    @Column({ type: "varchar", comment: "Razão social da empresa" })
    companyName!: string

    @Column({ type: "timestamp", comment: "Data de vencimento do certificado" })
    expirationDate!: Date

    @Column({ type: "varchar", comment: "Thumbprint do certificado", unique: true })
    thumbprint!: string

    @Column({
        type: "enum",
        enum: Ambiente,
        default: Ambiente.HOMOLOGACAO,
        comment: "Ambiente ao qual o certificado se destina"
    })
    ambiente!: Ambiente

    @Column({ type: "varchar", nullable: true, comment: "Emissor do certificado (Issuer)" })
    issuer?: string

    @Column({ type: "varchar", nullable: true, comment: "Subject do certificado" })
    subject?: string

    @Column({ default: true, comment: "Verificação se o certificado está ativo/inativo" })
    isActive!: boolean

    @CreateDateColumn({ comment: "Data de criação" })
    createdAt!: Date

    @OneToOne(() => SefazConfigModel, sefazConfig => sefazConfig.certificado)
    sefazConfig!: SefazConfigModel
}