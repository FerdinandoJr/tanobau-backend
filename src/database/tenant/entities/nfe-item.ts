import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { NFeModel } from './nfe'
import { moneyTransformer } from 'database/transformers/money.transformers'
import { Money } from 'core/valueObjects'


@Entity({ name: 'nfe_itens', comment: 'Tabela para armazenar os itens (produtos/serviços) de uma Nota Fiscal Eletrônica' })
export class NFeItemModel {
  @PrimaryGeneratedColumn({ comment: 'Código auto-incremental do item da NFe' })
  id!: number

  @Column({ 
    type: 'int', 
    comment: 'Número sequencial do item na nota fiscal (1, 2, 3...)' })
  numeroItem!: number

  @Column({ 
    type: 'varchar', 
    nullable: true, 
    comment: 'Descrição do produto ou serviço' })
  descricao!: string | null

  @Column({ 
    type: 'varchar', 
    length: 8, 
    nullable: true, 
    comment: 'Código NCM (Nomenclatura Comum do Mercosul) do produto' 
  })
  ncm!: string | null

  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 4, 
    comment: 'Quantidade comercializada do produto' 
  })
  quantidade!: number

  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    transformer: moneyTransformer,
    comment: 'Valor total bruto do item' 
  })
  valorTotal!: Money

  @Column({ type: 'int', comment: 'ID do documento fiscal' })
  documentId!: number

  @ManyToOne(() => NFeModel, nfe => nfe.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  nfe!: NFeModel
}