import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from "typeorm"
import { SefazDocumentModel } from "./sefaz-document"
import { FinancialInstallmentsStatus } from "modules/financialInstallments/domain/valueObjects/financial-installments-status.enum"
import { CNPJ } from "core/valueObjects"
import { cnpjTransformer } from "database/transformers/cnpj.transformers"
import { BeneficiaryType } from "modules/financialInstallments/domain/valueObjects/beneficiary-type.enum"

@Entity("financial_installments", { comment: "Parcelas de Nota Fiscal/CT-e" })
export class FinancialInstallmentModel {
  @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
  id!: number

  @Column({ nullable: true, comment: "nDup (Ex: 001, 002 ou 1/3)" })
  @Index()
  installmentNumber!: string | null

  @Column({ 
    nullable: true,
    type: "varchar",
    length: 14,
    transformer: cnpjTransformer,
    comment: "CNPJ de quem deve pagar (Pagador)"
  })
  payeeCnpj!: CNPJ | null

  @Column({
    type: "enum",
    enum: BeneficiaryType,
    default: BeneficiaryType.CNPJ,
    nullable: true,
    comment: "Tipo do Beneficiário (CPF ou CNPJ)"
  })
  beneficiaryType!: BeneficiaryType | null

  @Column({ nullable: true, comment: "Nome Razão Social ou Nome da Pessoa" })
  beneficiaryName!: string | null

  @Column({ type: "date", nullable: true, comment: "dVenc (Data de vencimento vinda do XML)" })
  dueDate!: Date | null

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true, comment: "vDup (O valor que consta na nota)" })
  expectedValue!: number | null

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true, comment: "Valor efetivamente pago (pode ter juros ou descontos)" })
  paidValue!: number | null

  @Column({
    type: "enum",
    enum: FinancialInstallmentsStatus,
    default: FinancialInstallmentsStatus.PENDING,
    comment: "Status da parcela",
    nullable: true
  })
  status!: FinancialInstallmentsStatus | null

  @Column({ type: "timestamp", nullable: true, comment: "Data da confirmação do pagamento" })
  paidAt!: Date | null

  @Column({ nullable: true, comment: "Ex: BOLETO, PIX, TED, CARTAO" })
  paymentMethod!: string | null

  @Column({ nullable: true, comment: "Linha digitável ou código de barras (se capturado via DDA/API)" })
  barcode!: string | null

  @Column({ type: "text", nullable: true, comment: "Notas sobre o pagamento" })
  observation!: string | null

  // Relacionamento com a Nota Fiscal/CT-e
  @ManyToOne(() => SefazDocumentModel, (doc) => doc.installments, { onDelete: "CASCADE" })
  document!: SefazDocumentModel | null

  @CreateDateColumn({ comment: "Data de criação" })
  createdAt!: Date

  @UpdateDateColumn({ comment: "Data de atualização" })
  updatedAt!: Date
}