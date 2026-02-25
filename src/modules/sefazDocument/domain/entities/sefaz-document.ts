import { CNPJ } from "core/valueObjects"
import { SefazDocumentStatus } from "modules/sefazDocument/domain/valueObjects/sefaz-document-status.enum"
import { SefazDocumentType } from "modules/sefazDocument/domain/valueObjects/sefaz-document-type.enum"

export interface SefazDocument {
    id: number
    accessKey: string
    nsu: string | null
    type: SefazDocumentType
    status: SefazDocumentStatus
    value: number | null
    emitterName: string | null
    emitterCnpj: CNPJ | null
    xml: string | null
}