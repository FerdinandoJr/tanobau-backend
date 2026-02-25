import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Index } from "typeorm"
import { SefazDocumentModel } from "./sefaz-document"

@Entity("sefaz_events", { comment: "Eventos da SEFAZ" })
export class SefazEventModel {
  @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
  id!: number

  @Column({ comment: "NSU (Número Sequencial do Único)" })
  @Index()
  nsu!: string

  @Column({ comment: "Ex: 110111 (Cancelamento), 110110 (CC-e)" })
  typeCode!: string

  @Column({ comment: "Ex: Cancelamento de NF-e" })
  description!: string

  @Column({ comment: "nSeqEvento" })
  sequence!: number

  @Column({ type: "text", comment: "XML do evento específico", nullable: true })
  xml!: string | null

  @ManyToOne(() => SefazDocumentModel, (doc) => doc.events, { onDelete: "CASCADE" })
  document!: SefazDocumentModel

  @CreateDateColumn({ comment: "Data de processamento" })
  processedAt!: Date
}