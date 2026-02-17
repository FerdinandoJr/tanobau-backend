import { UF } from "core/valueObjects/uf.enum"
import { SefazStatus } from "../valueObjects/sefaz-status.enum"

export interface ISefazResponse {
    uf: UF
    status: SefazStatus
    ultimoNSU: string
    maxNSU: string
    quantidadeNFes: number
    nfes: string[] // XMLs das NFes
    mensagem?: string
    dataConsulta: Date
}

export class SefazResponse implements ISefazResponse {
    uf: UF
    status: SefazStatus
    ultimoNSU: string
    maxNSU: string
    quantidadeNFes: number
    nfes: string[]
    mensagem?: string
    dataConsulta: Date

    constructor(props: ISefazResponse) {
        this.uf = props.uf
        this.status = props.status
        this.ultimoNSU = props.ultimoNSU
        this.maxNSU = props.maxNSU
        this.quantidadeNFes = props.quantidadeNFes
        this.nfes = props.nfes
        this.mensagem = props.mensagem
        this.dataConsulta = props.dataConsulta
    }
}
