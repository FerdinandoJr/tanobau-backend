import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { parseStringPromise } from "xml2js"
import { uuidv7 } from "uuidv7"

import { UF } from "core/valueObjects/uf.enum"
import { ISefazResponse } from "../domain/entities/sefaz-response"
import { SefazStatus } from "../domain/valueObjects/sefaz-status.enum"
import { ConfiguracaoSefazRepository } from "../data/repositories/configuracao-sefaz-repository-impl"
import { CertificadoService } from "modules/certificados/certificados.service"
import { CertificadoLoaderService } from "./certificado-loader.service"
import { SefazClientService } from "./sefaz-client.service"
import { NFeService } from "modules/nfes/nfes.service"
import { DataSource } from "typeorm"
import { TENANT_DATA_SOURCE } from "database/tenant/tenant.datasource.provider"
import { SyncLogModel } from "database/tenant/entities/sync_logs"
import { Inject } from "@nestjs/common"
import { CNPJ } from "core/valueObjects"

export interface SyncResult {
    uf: UF
    status: SefazStatus
    quantidadeProcessada: number
    ultimoNSU: string
    maxNSU: string
    mensagem: string
    dataConsulta: Date
}

@Injectable()
export class NFeSyncService {
    private readonly logger = new Logger(NFeSyncService.name)
    private syncLogRepo: any

    constructor(
        private configRepo: ConfiguracaoSefazRepository,
        private certService: CertificadoService,
        private certLoader: CertificadoLoaderService,
        private sefazClient: SefazClientService,
        private nfeService: NFeService,
        @Inject(TENANT_DATA_SOURCE) private tenantDs: DataSource
    ) {
        this.syncLogRepo = this.tenantDs.getRepository(SyncLogModel)
    }

    /**
     * Sincroniza NFes de uma UF específica
     */
    async syncByUF(uf: UF): Promise<SyncResult> {
        this.logger.log(`Iniciando sincronização para UF=${uf}`)

        // 1. Buscar configuração da UF
        const config = await this.configRepo.findByUF(uf)
        if (!config) {
            throw new NotFoundException(`Configuração SEFAZ não encontrada para UF=${uf}`)
        }

        if (!config.isActive) {
            throw new Error(`Configuração SEFAZ inativa para UF=${uf}`)
        }

        // 2. Carregar certificado
        const certificado = await this.certService.get(config.certificadoUuid)

        // 3. Validar certificado
        const validation = this.certLoader.validateCertificate(certificado)
        if (!validation.valid) {
            throw new Error(`Certificado inválido: ${validation.reason}`)
        }

        // 4. Preparar certificado
        const preparedCert = this.certLoader.prepareCertificate(certificado)

        // 5. Download de NFes
        const response = await this.sefazClient.downloadNFes(
            preparedCert,
            uf,
            config.ambiente,
            config.ultimoNSU
        )

        // 6. Processar NFes baixadas
        let quantidadeProcessada = 0
        if (response.status === SefazStatus.SUCESSO && response.nfes.length > 0) {
            quantidadeProcessada = await this.processNFes(response.nfes)
        }

        // 7. Atualizar configuração com novo NSU
        await this.configRepo.update(config.uuid, {
            ultimoNSU: response.maxNSU,
            maxNSU: response.maxNSU,
            ultimaConsulta: new Date()
        })

        // 8. Registrar log
        await this.createSyncLog(response, quantidadeProcessada)

        this.logger.log(`Sincronização concluída: ${quantidadeProcessada} NFes processadas`)

        return {
            uf: response.uf,
            status: response.status,
            quantidadeProcessada,
            ultimoNSU: config.ultimoNSU,
            maxNSU: response.maxNSU,
            mensagem: response.mensagem || "Sincronização concluída",
            dataConsulta: response.dataConsulta
        }
    }

    /**
     * Sincroniza todas as UFs ativas
     */
    async syncAll(): Promise<SyncResult[]> {
        this.logger.log("Iniciando sincronização de todas as UFs ativas")

        const configs = await this.configRepo.findActive()
        const results: SyncResult[] = []

        for (const config of configs) {
            try {
                const result = await this.syncByUF(config.uf)
                results.push(result)
            } catch (error: any) {
                this.logger.error(`Erro ao sincronizar UF=${config.uf}: ${error.message}`)
                results.push({
                    uf: config.uf,
                    status: SefazStatus.ERRO,
                    quantidadeProcessada: 0,
                    ultimoNSU: config.ultimoNSU,
                    maxNSU: config.maxNSU,
                    mensagem: error.message,
                    dataConsulta: new Date()
                })
            }
        }

        return results
    }

    /**
     * Processa XMLs de NFes baixados
     */
    private async processNFes(xmls: string[]): Promise<number> {
        let processadas = 0

        for (const xml of xmls) {
            try {
                const nfeData = await this.parseNFeXML(xml)

                // Verificar se NFe já existe
                const exists = await this.nfeService.getByChaveNFe(nfeData.chNfe).catch(() => null)

                if (!exists) {
                    await this.nfeService.create(nfeData)
                    processadas++
                    this.logger.debug(`NFe ${nfeData.chNfe} salva com sucesso`)
                } else {
                    this.logger.debug(`NFe ${nfeData.chNfe} já existe, pulando`)
                }
            } catch (error: any) {
                this.logger.error(`Erro ao processar NFe: ${error.message}`, error.stack)
            }
        }

        return processadas
    }

    /**
     * Faz parse do XML da NFe e extrai dados principais
     */
    private async parseNFeXML(xml: string): Promise<any> {
        const parsed = await parseStringPromise(xml, { explicitArray: false })

        const nfe = parsed.nfeProc?.NFe?.infNFe || parsed.NFe?.infNFe
        const prot = parsed.nfeProc?.protNFe?.infProt

        if (!nfe) {
            throw new Error("XML inválido: estrutura NFe não encontrada")
        }

        const ide = nfe.ide
        const emit = nfe.emit
        const dest = nfe.dest
        const total = nfe.total?.ICMSTot

        return {
            uuid: uuidv7(),
            chNfe: prot?.chNFe || nfe.$?.Id?.replace('NFe', ''),
            nsu: prot?.nProt || '0',
            uf: this.getUFFromCode(ide.cUF),
            tipoDocumento: "55", // NFe
            numeroNota: ide.nNF,
            serie: ide.serie,
            dataEmissao: new Date(ide.dhEmi),
            cnpjEmitente: new CNPJ(emit.CNPJ || emit.CPF),
            nomeEmitente: emit.xNome,
            cnpjDestinatario: dest?.CNPJ ? new CNPJ(dest.CNPJ) : undefined,
            nomeDestinatario: dest?.xNome,
            naturezaOperacao: ide.natOp,
            valorTotal: parseFloat(total?.vNF || '0'),
            status: prot?.cStat === '100' ? 'autorizada' : 'pendente',
            createdAt: new Date()
        }
    }

    /**
     * Converte código de UF para enum
     */
    private getUFFromCode(code: string): UF {
        const ufMap: Record<string, UF> = {
            '12': UF.AC, '27': UF.AL, '16': UF.AP, '13': UF.AM,
            '29': UF.BA, '23': UF.CE, '53': UF.DF, '32': UF.ES,
            '52': UF.GO, '21': UF.MA, '51': UF.MT, '50': UF.MS,
            '31': UF.MG, '15': UF.PA, '25': UF.PB, '41': UF.PR,
            '26': UF.PE, '22': UF.PI, '33': UF.RJ, '24': UF.RN,
            '43': UF.RS, '11': UF.RO, '14': UF.RR, '42': UF.SC,
            '35': UF.SP, '28': UF.SE, '17': UF.TO
        }
        return ufMap[code] || UF.SP
    }

    /**
     * Cria log de sincronização
     */
    private async createSyncLog(response: ISefazResponse, quantidadeProcessada: number): Promise<void> {
        const log = this.syncLogRepo.create({
            uuid: uuidv7(),
            uf: response.uf,
            data_execucao: response.dataConsulta,
            status: response.status,
            quantidade_nfes: quantidadeProcessada,
            ultimo_nsu: response.ultimoNSU,
            max_nsu: response.maxNSU,
            mensagem: response.mensagem,
            tempo_execucao: 0
        })

        await this.syncLogRepo.save(log)
    }
}
