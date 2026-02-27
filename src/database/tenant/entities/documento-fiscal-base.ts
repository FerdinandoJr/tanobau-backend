import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, TableInheritance, OneToMany } from 'typeorm';
import { DocumentoEventoModel } from './documento-evento';
import { DuplicataFiscalModel } from './duplicata-fiscal';
import { cnpjTransformer } from 'database/transformers/cnpj.transformers';
import { CNPJ } from 'core/valueObjects';
import { DocumentoFiscalStatus } from 'core/valueObjects/documento-fiscal-status.enum';
import { documentoTransformer } from 'database/transformers/document.transformer';


@Entity({ name: 'documentos_fiscais', comment: 'Tabela base para armazenamento de documentos fiscais (NFe, CTe)' })
@TableInheritance({ column: { type: 'varchar', name: 'tipo_documento' } })
export abstract class DocumentoFiscalBaseModel {
  @PrimaryGeneratedColumn({ comment: 'Código auto-incremental' })
  id!: number

  @Column({ length: 44, unique: true, comment: 'Chave de acesso do documento fiscal' })
  chaveAcesso!: string

  @Column({ 
    type: 'varchar', 
    length: 14, 
    transformer: documentoTransformer, // Nome mais genérico
    nullable: true,
    comment: 'Documento (CNPJ/CPF) do emitente' 
  })
  documentoEmitente?: string | null;

  @Column({ 
    type: 'varchar', 
    length: 14, 
    transformer: documentoTransformer,
    nullable: true,
    comment: 'Documento (CNPJ/CPF) do destinatário' 
  })
  documentoDestinatario?: string | null;

  @Column({ 
    type: 'varchar', 
    comment: 'Número do documento fiscal' 
  })
  numero!: string

  @Column({ 
    type: 'varchar', 
    comment: 'Série do documento fiscal' 
  })
  serie!: string

  @Column({ 
    type: 'enum', 
    enum: DocumentoFiscalStatus, 
    comment: 'Status atual do documento fiscal (Ex: Autorizada, Cancelada, Denegada, Resumo)' 
  })
  status!: DocumentoFiscalStatus

  @Column({ 
    type: 'varchar', 
    nullable: true, 
    comment: 'Número do protocolo de autorização' 
  })
  protocolo?: string | null

  @Column({ 
    type: 'timestamp', 
    nullable: true, 
    comment: 'Data e hora de emissão do documento' 
  })
  dataEmissao?: Date | null

  @Column({ 
    type: 'timestamp', 
    nullable: true, 
    comment: 'Data e hora de autorização do documento' 
  })
  dataAutorizacao?: Date | null

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Conteúdo original em formato XML retornado pela SEFAZ' 
  })
  xmlBruto?: string | null // O XML original retornado pela URL

  @CreateDateColumn({ 
    type: 'timestamp', 
    comment: 'Data em que o documento foi capturado pelo sistema' 
  })
  capturadoEm!: Date

  @UpdateDateColumn({ 
    type: 'timestamp', 
    comment: 'Data da última atualização do registro' 
  })
  atualizadoEm!: Date

  // Relacionamentos comuns a qualquer documento
  @OneToMany(() => DocumentoEventoModel, evento => evento.documento, { cascade: true })
  eventos!: DocumentoEventoModel[]

  @OneToMany(() => DuplicataFiscalModel, duplicata => duplicata.documento, { cascade: true })
  duplicatas!: DuplicataFiscalModel[]
}