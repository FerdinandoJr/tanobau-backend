import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { CTeModel } from './cte'

@Entity({ name: 'cte_documentos_relacionados', comment: 'Tabela para vincular as Notas Fiscais (NFe) que estão sendo transportadas por um CTe' })
export class CTeDocRelacionadoModel {
  @PrimaryGeneratedColumn({ comment: 'Código auto-incremental da relação' })
  id!: number

  @Column({ length: 44, comment: 'Chave de acesso da NFe que está relacionada/transportada no CTe' })
  chaveNFe!: string // A nota fiscal que está dentro do caminhão

  @Column({ type: 'int', comment: 'ID do documento fiscal' })
  documentId!: number

  @ManyToOne(() => CTeModel, cte => cte.documentosRelacionados, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  cte!: CTeModel
}