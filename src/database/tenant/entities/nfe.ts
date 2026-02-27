import { ChildEntity, Column, OneToMany } from 'typeorm'
import { DocumentoFiscalBaseModel } from './documento-fiscal-base'
import { NFeItemModel } from './nfe-item'
import { moneyTransformer } from 'database/transformers/money.transformers'
import { Money, UF } from 'core/valueObjects'


@ChildEntity('NFE')
export class NFeModel extends DocumentoFiscalBaseModel {
  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    nullable: true, 
    transformer: moneyTransformer,
    comment: 'Valor total da Nota Fiscal' 
  })
  totalNota?: Money | null

  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    nullable: true, 
    transformer: moneyTransformer,
    comment: 'Valor total do ICMS da Nota Fiscal' })
  valorIcms?: Money | null

  @Column({ 
    type: 'enum', 
    enum: UF, 
    nullable: true,
    comment: 'Unidade Federativa (UF) de destino' })
  ufDestino?: UF | null

  @OneToMany(() => NFeItemModel, item => item.nfe, { cascade: true })
  itens!: NFeItemModel[]
}