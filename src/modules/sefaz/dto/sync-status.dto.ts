import { UF } from "core/valueObjects/uf.enum"
import { SefazStatus } from "../domain/valueObjects/sefaz-status.enum"

export type SyncStatusResponseDTO = {
    uf: UF
    status: SefazStatus
    quantidadeProcessada: number
    ultimoNSU: string
    maxNSU: string
    mensagem: string
    dataConsulta: Date
}
