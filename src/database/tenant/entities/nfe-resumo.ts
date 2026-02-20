import { DocumentStatus } from "modules/nfes/domain/valueObjects/document-status.enum";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "nfe_resumos", comment: "Tabela de Resumos de NFEs (resNFe)" })
@Index(["ch_nfe"], { unique: true })
@Index(["nsu"])
@Index(["cnpj_emitente"])
@Index(["data_emissao"])
export class NFeResumoModel {
    @PrimaryGeneratedColumn({ comment: "Código auto-incremental" })
    id!: number;

    @Column({ type: "uuid", comment: "Código único para o resumo", unique: true })
    uuid!: string;

    @Column({ length: 44, unique: true, comment: "Chave de acesso da NFE" })
    ch_nfe!: string;

    @Column({ length: 15, comment: "Número Sequencial Único na SEFAZ" })
    nsu!: string;

    @Column({ length: 14, comment: "CNPJ do Emitente" })
    cnpj_emitente!: string;

    @Column({ comment: "Nome/Razão Social do Emitente" })
    nome_emitente!: string;

    @Column({ type: "timestamp", comment: "Data de Emissão" })
    data_emissao!: Date;

    @Column({ type: "decimal", precision: 15, scale: 2, comment: "Valor Total da Nota" })
    valor_total!: number;

    // 1=Entrada, 0=Saída (Usually defined by sender/receiver relation, but SEFAZ sends type in full NFe)
    // resNFe has tpNFe: 0-Entrada / 1-Saída
    @Column({ type: "int", comment: "Tipo de Operação (0-Entrada, 1-Saída)", nullable: true })
    tipo_operacao!: number;

    @Column({ type: "enum", enum: DocumentStatus, default: DocumentStatus.PENDING, comment: "Status do Documento" })
    status!: DocumentStatus;

    @Column({ type: "timestamp", nullable: true, comment: "Data de Recebimento pelo Destinatário" })
    data_recebimento!: Date;

    @CreateDateColumn({ type: "timestamp", comment: "Data de criação do registro" })
    createdAt!: Date;
}
