import { CNPJ } from "./cnpj"
import { DocumentoFiscalStatus } from "./documento-fiscal-status.enum"

export interface DocumentoFiscalBase {
  id: number
  chaveAcesso: string
  documentoEmitente?: string | null
  documentoDestinatario?: string | null
  numero: string
  serie: string
  status: DocumentoFiscalStatus // Autorizada, Cancelada, Denegada, Resumo
  protocolo?: string | null
  dataEmissao?: Date | null
  dataAutorizacao?: Date | null
  xmlBruto?: string | null // O XML original retornado pela SEFAZ
  capturadoEm: Date
  atualizadoEm: Date

// Relacionamentos comuns a qualquer documento
//   eventos: DocumentoEvento[]

//   duplicatas: DuplicataFiscal[]
}