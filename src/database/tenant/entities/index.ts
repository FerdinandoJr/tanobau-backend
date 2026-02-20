import { CertificadoModel } from "./certificados"
import { ConfiguracaoSefaz } from "./configura-sefaz"
import { ConfiguracaoSefazPorUF } from "./configuracao-sefaz-por-uf"
import { NFeResumoModel } from "./nfe-resumo"
import { NFeModel } from "./nfes"
import { SyncLogModel } from "./sync_logs"


export const TenantModels = [
    CertificadoModel,
    ConfiguracaoSefaz,
    ConfiguracaoSefazPorUF,
    NFeModel,
    SyncLogModel,
    NFeResumoModel
]
