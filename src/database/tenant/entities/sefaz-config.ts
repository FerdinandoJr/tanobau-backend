import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { CertificadoModel } from './certificados'
import { cnpjTransformer } from 'database/transformers/cnpj.transformers'
import { CNPJ } from 'core/valueObjects'
import { Ambiente } from 'core/valueObjects/ambiente'

@Entity({ name: 'sefaz_config', comment: 'Tabela de configuração para integração com a SEFAZ (NSU, ambiente, certificado)' })
export class SefazConfigModel {
  @PrimaryGeneratedColumn({ comment: 'Código auto-incremental da configuração' })
  id!: number

  @Column({ 
    type: "uuid", 
    comment: "Código único para o tenant", 
    unique: true 
  })
  uuid!: string

  @Column({ 
    type: 'varchar', 
    length: 14, 
    unique: true, 
    transformer: cnpjTransformer, 
    comment: 'CNPJ do interessado (empresa que está consultando os documentos)' 
  })
  cnpjInteressado!: CNPJ

  @Column({ 
    type: 'varchar', 
    length: 15, 
    default: '0', 
    comment: 'Último NSU (Número Sequencial Único) de NFe consultado na SEFAZ para este CNPJ' 
  })
  ultimoNSU_NFe!: string

  @Column({ 
    type: 'varchar', 
    length: 15, 
    default: '0', 
    comment: 'Último NSU (Número Sequencial Único) de CTe consultado na SEFAZ para este CNPJ' 
  })
  ultimoNSU_CTe!: string

  @Column({ 
    type: 'enum', 
    enum: Ambiente, 
    default: Ambiente.PRODUCAO, 
    comment: 'Ambiente da SEFAZ (1: Produção, 2: Homologação)' 
  })
  ambiente!: Ambiente

  @Column({ type: 'int', comment: "Relaciona com a tabela de Certificados" })
  certificadoId!: number

  @OneToOne(() => CertificadoModel, certificado => certificado.sefazConfig)
  @JoinColumn({ name: 'certificadoId' })
  certificado!: CertificadoModel
}