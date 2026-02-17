import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { CertificadoModel } from "./certificados"
import { UF } from "core/valueObjects/uf.enum"
import { CertificadoAmbiente } from "modules/certificados/domain/valueObjects/certificado-ambiente.enum"

@Entity({ name: "configuracoes_sefaz_por_uf", comment: "Configurações de SEFAZ por UF para suporte multi-estado" })
export class ConfiguracaoSefazPorUF {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number

    @Column({ type: "uuid", comment: "Código único para a configuração", unique: true })
    uuid!: string

    @Column({
        type: "enum",
        enum: UF,
        comment: "UF (Unidade Federativa)"
    })
    uf!: UF

    @Column({
        type: "enum",
        enum: CertificadoAmbiente,
        default: CertificadoAmbiente.HOMOLOGACAO,
        comment: "Ambiente de SEFAZ"
    })
    ambiente!: CertificadoAmbiente

    @Column({
        type: "bigint",
        default: "0",
        comment: "Último NSU processado desta UF"
    })
    ultimo_nsu!: string

    @Column({
        type: "bigint",
        default: "0",
        comment: "Máximo NSU disponível desta UF"
    })
    max_nsu!: string

    @Column({
        type: "timestamp",
        nullable: true,
        comment: "Data da última consulta bem-sucedida nesta UF"
    })
    ultima_consulta?: Date

    @Column({
        type: "integer",
        comment: "ID do certificado usado para esta UF/ambiente"
    })
    certificadoId!: number

    @ManyToOne(() => CertificadoModel)
    @JoinColumn({ name: "certificadoId" })
    certificado!: CertificadoModel

    @Column({
        default: true,
        comment: "Se esta UF está ativa para sincronização automática"
    })
    isActive!: boolean

    @Column({
        default: true,
        comment: "Se o serviço da SEFAZ desta UF está operacional"
    })
    status_servico!: boolean

    @CreateDateColumn({ comment: "Data de criação" })
    createdAt!: Date

    @UpdateDateColumn({ comment: "Data da última atualização" })
    updatedAt!: Date
}
