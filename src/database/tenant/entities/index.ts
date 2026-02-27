import { CertificadoModel } from "./certificados"
import { NFeModel } from "./nfe"
import { CTeModel } from "./cte"
import { DocumentoEventoModel } from "./documento-evento"
import { DuplicataFiscalModel } from "./duplicata-fiscal"
import { NFeItemModel } from "./nfe-item"
import { CTeDocRelacionadoModel } from "./cte-documentos-relacionados"
import { SefazConfigModel } from "./sefaz-config"
import { DocumentoFiscalBaseModel } from "./documento-fiscal-base"

export const TenantModels = [
    CertificadoModel,
    DocumentoFiscalBaseModel,
    NFeModel,
    CTeModel,
    DocumentoEventoModel,
    DuplicataFiscalModel,
    NFeItemModel,
    CTeDocRelacionadoModel,
    SefazConfigModel,
]
