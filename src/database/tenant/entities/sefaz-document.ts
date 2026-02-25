import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from "typeorm"
import { SefazEventModel } from "./sefaz-event"
import { FinancialInstallmentModel } from "./financial_installments"
import { SefazDocumentType } from "modules/sefazDocument/domain/valueObjects/sefaz-document-type.enum"
import { CNPJ } from "core/valueObjects"
import { cnpjTransformer } from "database/transformers/cnpj.transformers"
import { SefazDocumentStatus } from "modules/sefazDocument/domain/valueObjects/sefaz-document-status.enum"
import { OperationType } from "modules/sefazDocument/domain/valueObjects/operation-type.enum"

@Entity("sefaz_documents", { comment: "Documentos emitidos pela SEFAZ" })
export class SefazDocumentModel {
  @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
  id!: number

  @Column({ comment: "Chave de Acesso (44 dígitos)" })
  @Index({ unique: true })
  accessKey!: string

  @Column({ comment: "NSU (Número Sequencial do Único)", nullable: true })
  nsu!: string | null

  @Column({
    type: "enum",
    enum: SefazDocumentType,
    default: SefazDocumentType.NFE,
    comment: "Tipo do documento (NFe, CTe, etc.)"
  })
  type!: SefazDocumentType

  @Column({
    type: "enum",
    enum: SefazDocumentStatus,
    default: SefazDocumentStatus.SUMMARY,
    comment: "Se é apenas o resumo (resNFe) ou completa (procNFe)"
  })
  status!: SefazDocumentStatus

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true, comment: "Valor total do documento" })
  value!: number | null

  @Column({ nullable: true, comment: "Nome do emitente" })
  emitterName!: string | null

  @Column({
    type: "varchar",
    length: 18,
    transformer: cnpjTransformer,
    nullable: true
  })
  emitterCnpj!: CNPJ | null

  @Column({
    type: "enum",
    enum: OperationType,
    comment: "0=Entrada, 1=Saída"
  })
  operationType!: OperationType | null

  @Column({ nullable: true, comment: "Descrição da operação" })
  operationDescription!: string | null

  @Column({ nullable: true, comment: "CFOP principal" })
  mainCfop!: string | null

  @Column({ type: "text", nullable: true, comment: "O XML bruto para conformidade legal (5 anos)" })
  xml!: string | null

  @OneToMany(() => SefazEventModel, (event) => event.document)
  events!: SefazEventModel[]

  @OneToMany(() => FinancialInstallmentModel, (installment) => installment.document)
  installments!: FinancialInstallmentModel[]

  @CreateDateColumn({ comment: "Data de criação" })
  createdAt!: Date

  @UpdateDateColumn({ comment: "Data de atualização" })
  updatedAt!: Date
}