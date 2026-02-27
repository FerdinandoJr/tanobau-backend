import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { DocumentoFiscalBaseModel } from './documento-fiscal-base'
import { moneyTransformer } from 'database/transformers/money.transformers'
import { Money } from 'core/valueObjects'

@Entity({ name: 'duplicatas_fiscais', comment: 'Tabela para armazenar as duplicatas (parcelas de cobrança) vinculadas a um documento fiscal' })
export class DuplicataFiscalModel {
  @PrimaryGeneratedColumn({ comment: 'Código auto-incremental da duplicata' })
  id!: number

  @Column({ 
    type: 'varchar',
    length: 60, 
    nullable: true, 
    comment: 'Número da duplicata (Ex: 001/3, 002/3)' 
  })
  numeroDuplicata?: string | null// Ex: "001/3"

  @Column({ 
    type: 'date', 
    nullable: true,
    comment: 'Data de vencimento da parcela' 
  })
  dataVencimento?: Date | null

  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    transformer: moneyTransformer,
    comment: 'Valor da parcela/duplicata' 
  })
  valor!: Money

  @Column({ 
    type: 'int', 
    comment: 'ID do documento fiscal'
  })
  documentId!: number

  @ManyToOne(() => DocumentoFiscalBaseModel, doc => doc.duplicatas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  documento!: DocumentoFiscalBaseModel
}