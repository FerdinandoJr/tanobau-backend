import { UF } from "core/valueObjects/uf.enum"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "sync_logs", comment: "Tabela de logs de sincronização" })
export class SyncLogModel {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({ type: "uuid", comment: "Código único para logs", unique: true })
    uuid!: string

    @Column({
        type: "enum",
        enum: UF,
        nullable: true,
        comment: "UF da sincronização"
    })
    uf?: UF

    @CreateDateColumn({ comment: "Data de início da sincronização" })
    data_execucao!: Date

    @Column({
        type: "timestamp",
        nullable: true,
        comment: "Data de término da sincronização"
    })
    data_termino?: Date

    @Column({
        type: "integer",
        nullable: true,
        comment: "Tempo de execução em segundos"
    })
    tempo_execucao_segundos?: number

    @Column({
        type: "bigint",
        nullable: true,
        comment: "NSU inicial da sincronização"
    })
    nsu_inicial?: string

    @Column({
        type: "bigint",
        nullable: true,
        comment: "NSU final da sincronização"
    })
    nsu_final?: string

    @Column({ default: false, comment: "Verificação se a sincronização foi bem-sucedida" })
    sucesso!: boolean

    @Column({ type: "text", nullable: true, comment: "Mensagem de erro" })
    mensagem_erro?: string

    @Column({ default: 0, comment: "Quantidade de notas baixadas" })
    quantidade_notas_baixadas!: number

    @Column({
        type: "enum",
        enum: ["manual", "automatica"],
        default: "automatica",
        comment: "Tipo de sincronização"
    })
    tipo_sincronizacao!: "manual" | "automatica"
}