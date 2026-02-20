import { DocumentStatus } from "modules/nfes/domain/valueObjects/document-status.enum"
import { DocumentType } from "modules/nfes/domain/valueObjects/document-type.enum"
import { TipoMovimentacao } from "modules/nfes/domain/valueObjects/tipo-movimentacao.enum"
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "nfes", comment: "Tabela de NFEs" })
@Index(["cnpj_emitente"])
@Index(["data_emissao"])
@Index(["status"])
@Index(["nsu"])
@Index(["uf"])
export class NFeModel {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({ type: "uuid", comment: "Código único para nfes", unique: true })
    uuid!: string

    @Column({ length: 44, unique: true, comment: "Chave de acesso da NFE" })
    ch_nfe!: string

    @Column({ type: "bigint", comment: "Número sequencial único para cada nota" })
    nsu!: string

    @Column({ type: "char", length: 2, comment: "UF de emissão da NFe" })
    uf!: string

    @Column({ type: "integer", comment: "Número da NFe" })
    numero_nfe!: number

    @Column({ type: "integer", comment: "Série da NFe" })
    serie_nfe!: number

    @Column({
        type: "enum",
        enum: DocumentType,
        default: DocumentType.NFE,
        comment: "Tipo de documento"
    })
    tipo_documento!: DocumentType

    @Column({ type: "text", nullable: true, comment: "XML bruto da NFE" })
    xml_bruto?: string | null

    @Column({ type: "timestamp", comment: "Data de emissão da NFE" })
    data_emissao!: Date

    @Column({ type: "decimal", precision: 12, scale: 2, comment: "Valor total da NFE" })
    valor_total!: number

    @Column({ length: 14, comment: "CNPJ emitente da NFE" })
    cnpj_emitente!: string

    @Column({ type: "varchar", nullable: true, comment: "Nome/Razão social do emitente" })
    nome_emitente?: string

    @Column({ length: 14, nullable: true, comment: "CNPJ/CPF do destinatário" })
    cnpj_destinatario?: string

    @Column({ type: "varchar", nullable: true, comment: "Nome do destinatário" })
    nome_destinatario?: string

    @Column({ type: "varchar", nullable: true, comment: "Natureza da operação" })
    natureza_operacao?: string

    @Column({
        type: "enum",
        enum: TipoMovimentacao,
        nullable: true,
        comment: "Tipo de movimentação"
    })
    tipo_movimentacao?: TipoMovimentacao

    @Column({
        type: "enum",
        enum: DocumentStatus,
        default: DocumentStatus.PENDING,
        comment: "Status da NFE"
    })
    status!: DocumentStatus

    @CreateDateColumn({ comment: "Data de criação" })
    createdAt!: Date
}