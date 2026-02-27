import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { DocumentoFiscalBaseModel } from './documento-fiscal-base'

@Entity({ name: 'documento_eventos', comment: 'Tabela para armazenar os eventos vinculados aos documentos fiscais (ex: Cancelamento, CCe, Manifesto)' })
export class DocumentoEventoModel {
  @PrimaryGeneratedColumn({ comment: 'Código auto-incremental do evento' })
  id!: number

  @Column({ 
    type: 'varchar', 
    length: 44, 
    nullable: true,
    comment: 'Chave de acesso do documento fiscal ao qual o evento está vinculado' 
  })
  chaveAcesso?: string | null

  @Column({ 
    type: 'varchar', 
    length: 10, 
    comment: 'Tipo do evento (ex: 110110 para CCe, 110111 para Cancelamento)' 
  })
  tipoEvento!: string

  @Column({ 
    type: 'varchar',
    nullable: true,
    comment: 'Descrição do evento (ex: CARTA DE CORRECAO, CANCELAMENTO)' 
  })
  descricaoEvento?: string | null

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Detalhes ou justificativa do evento (ex: texto da carta de correção)' 
  })
  detalheEvento?: string | null

  @Column({ type: 'timestamp', comment: 'Data e hora em que o evento ocorreu ou foi registrado na SEFAZ' })
  dataEvento!: Date

  @Column({ 
    type: 'varchar', 
    length: 15, 
    comment: 'Número do protocolo de homologação do evento na SEFAZ' 
  })
  protocolo!: string

  @Column({ 
    type: 'int', 
    nullable: true,
    comment: 'ID do documento fiscal ao qual o evento está vinculado' 
  })
  documentId?: number | null

  @ManyToOne(() => DocumentoFiscalBaseModel, doc => doc.eventos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  documento?: DocumentoFiscalBaseModel | null
}