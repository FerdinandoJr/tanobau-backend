import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "configuracoes_sefaz", comment: "Tabela de configurações de Sefaz" })
export class ConfiguracaoSefaz {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({ type: "uuid", comment: "Código único para o configura-sefaz", unique: true })
    uuid!: string

    @Column({ type: "bigint", default: "0", comment: "Ultimo NSU" })
    ultimo_nsu!: string

    @Column({ type: "bigint", default: "0", comment: "Ultimo NSU" })
    max_nsu!: string

    @Column({ type: "enum", enum: ["producao", "homologacao"], default: "homologacao", comment: "Ambiente de Sefaz" })
    ambiente!: string

    @Column({ type: "timestamp", nullable: true, comment: "Data da ultima consulta" })
    ultima_consulta!: Date

    @Column({ default: true, comment: "Status do serviço" })
    status_servico!: boolean
}