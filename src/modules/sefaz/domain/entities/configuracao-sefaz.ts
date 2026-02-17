import { UF } from "core/valueObjects/uf.enum"
import { CertificadoAmbiente } from "modules/certificados/domain/valueObjects/certificado-ambiente.enum"

export type ConfiguracaoSefazId = number

export interface IConfiguracaoSefaz {
    id: ConfiguracaoSefazId
    uuid: string
    uf: UF
    ambiente: CertificadoAmbiente
    ultimoNSU: string
    maxNSU: string
    ultimaConsulta?: Date
    certificadoUuid: string
    isActive: boolean
    statusServico: boolean
    createdAt: Date
    updatedAt: Date
}

export class ConfiguracaoSefaz implements IConfiguracaoSefaz {
    id: ConfiguracaoSefazId
    uuid: string
    uf: UF
    ambiente: CertificadoAmbiente
    ultimoNSU: string
    maxNSU: string
    ultimaConsulta?: Date
    certificadoUuid: string
    isActive: boolean
    statusServico: boolean
    createdAt: Date
    updatedAt: Date

    constructor(props: IConfiguracaoSefaz) {
        this.id = props.id
        this.uuid = props.uuid
        this.uf = props.uf
        this.ambiente = props.ambiente
        this.ultimoNSU = props.ultimoNSU
        this.maxNSU = props.maxNSU
        this.ultimaConsulta = props.ultimaConsulta
        this.certificadoUuid = props.certificadoUuid
        this.isActive = props.isActive
        this.statusServico = props.statusServico
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
    }
}
