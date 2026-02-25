import { CNPJ } from "core/valueObjects"
import { cnpjTransformer } from "database/transformers/cnpj.transformers"
import { Entity, PrimaryGeneratedColumn, Column, Index, UpdateDateColumn } from "typeorm"

@Entity("sefaz_sync_control", { comment: "Controle de sincronização com a SEFAZ" })
export class SefazSyncControl {
  @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
  id!: number

  @Column({
    type: "varchar",
    length: 14,
    transformer: cnpjTransformer,
    comment: "CNPJ do Tenant"
  })
  @Index({ unique: true })
  tenantCnpj!: CNPJ

  @Column({ comment: "Último NSU processado" })
  lastNsu!: string

  @UpdateDateColumn({ comment: "Data de sincronização" })
  lastSync!: Date
}