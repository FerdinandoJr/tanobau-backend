import { ChildEntity, Column, OneToMany } from 'typeorm'
import { CTeDocRelacionadoModel } from './cte-documentos-relacionados'
import { DocumentoFiscalBaseModel } from './documento-fiscal-base'
import { moneyTransformer } from 'database/transformers/money.transformers'
import { CNPJ, Money } from 'core/valueObjects'
import { TomadorServico } from 'core/valueObjects/tomador-servico.enum'
import { cnpjTransformer } from 'database/transformers/cnpj.transformers'
import { documentoTransformer } from 'database/transformers/document.transformer'

@ChildEntity('CTE')
export class CTeModel extends DocumentoFiscalBaseModel {
  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    nullable: true,
    transformer: moneyTransformer,
    comment: 'Valor total da prestação do serviço' 
  })
  valorPrestacao?: Money | null

  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 4, 
    nullable: true,
    comment: 'Peso total da carga em Kg' 
  })
  pesoCarga?: number | null

  @Column({ 
    type: 'varchar', 
    length: 14, 
    nullable: true,
    transformer: documentoTransformer,
    comment: 'Documento (CNPJ/CPF) do remetente da carga' 
  })
  documentoRemetente?: string | null

  @Column({ 
    type: "enum", 
    enum: TomadorServico, 
    nullable: true, 
    comment: 'Indicador do papel do tomador do serviço (0-Rem, 1-Exp, 2-Rec, 3-Dest)' 
  })
  tomadorServico?: TomadorServico | null // 0-Rem, 1-Exp, 2-Rec, 3-Dest

  @OneToMany(() => CTeDocRelacionadoModel, doc => doc.cte, { cascade: true })
  documentosRelacionados!: CTeDocRelacionadoModel[]
}