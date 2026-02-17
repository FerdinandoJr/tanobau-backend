import { Injectable, Logger } from "@nestjs/common"

import { UF } from "core/valueObjects/uf.enum"
import { CertificadoAmbiente } from "modules/certificados/domain/valueObjects/certificado-ambiente.enum"
import { ISefazResponse, SefazResponse } from "../domain/entities/sefaz-response"
import { SefazStatus } from "../domain/valueObjects/sefaz-status.enum"
import { PreparedCertificate } from "./certificado-loader.service"

@Injectable()
export class SefazClientService {
    private readonly logger = new Logger(SefazClientService.name)

    /**
     * Baixa NFes da SEFAZ usando o serviço DistDFe
     * 
     * NOTA: Esta é uma implementação MOCK/SIMPLIFICADA
     * Para produção, integrar com biblioteca node-dfe ou implementar cliente SOAP
     */
    async downloadNFes(
        certificate: PreparedCertificate,
        uf: UF,
        ambiente: CertificadoAmbiente,
        ultimoNSU: string
    ): Promise<ISefazResponse> {
        this.logger.log(`[MOCK] Downloading NFes for UF=${uf}, NSU=${ultimoNSU}, Ambiente=${ambiente}`)

        try {
            // TODO: Implementar chamada real ao webservice SEFAZ
            // Exemplo com node-dfe:
            // const dfe = new DistDFe({
            //   certificado: {
            //     pfx: certificate.pfx,
            //     senha: certificate.passphrase
            //   },
            //   ambiente: ambiente === CertificadoAmbiente.PRODUCAO ? 'producao' : 'homologacao'
            // })
            // const resultado = await dfe.consultar(certificate.cnpj, ultimoNSU)

            // Por enquanto, retorna resposta mock
            return this.mockSefazResponse(uf, ultimoNSU)

        } catch (error: any) {
            this.logger.error(`Erro ao baixar NFes: ${error.message}`, error.stack)

            return new SefazResponse({
                uf,
                status: SefazStatus.ERRO,
                ultimoNSU,
                maxNSU: ultimoNSU,
                quantidadeNFes: 0,
                nfes: [],
                mensagem: error.message,
                dataConsulta: new Date()
            })
        }
    }

    /**
     * Resposta mock para testes
     * Remove quando integrar com SEFAZ real
     */
    private mockSefazResponse(uf: UF, ultimoNSU: string): ISefazResponse {
        const mockNFes: string[] = []
        const proximoNSU = (parseInt(ultimoNSU) + 5).toString()

        // Simula que não há documentos novos 70% das vezes
        const temDocumentos = Math.random() > 0.7

        if (temDocumentos) {
            // Adiciona 1-3 NFes mock
            const quantidade = Math.floor(Math.random() * 3) + 1
            for (let i = 0; i < quantidade; i++) {
                mockNFes.push(this.generateMockNFeXML(uf))
            }
        }

        return new SefazResponse({
            uf,
            status: mockNFes.length > 0 ? SefazStatus.SUCESSO : SefazStatus.SEM_DOCUMENTOS,
            ultimoNSU,
            maxNSU: proximoNSU,
            quantidadeNFes: mockNFes.length,
            nfes: mockNFes,
            mensagem: mockNFes.length > 0
                ? `${mockNFes.length} documento(s) recuperado(s)`
                : "Nenhum documento encontrado",
            dataConsulta: new Date()
        })
    }

    /**
     * Gera XML mock de NFe para testes
     */
    private generateMockNFeXML(uf: UF): string {
        const chaveNFe = this.generateMockChaveNFe(uf)

        return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe${chaveNFe}">
      <ide>
        <cUF>${this.getUFCode(uf)}</cUF>
        <natOp>VENDA DE MERCADORIA</natOp>
        <mod>55</mod>
        <serie>1</serie>
        <nNF>12345</nNF>
        <dhEmi>${new Date().toISOString()}</dhEmi>
        <tpNF>1</tpNF>
      </ide>
      <emit>
        <CNPJ>12345678000190</CNPJ>
        <xNome>EMPRESA MOCK LTDA</xNome>
      </emit>
      <dest>
        <CNPJ>98765432000100</CNPJ>
        <xNome>DESTINATARIO MOCK LTDA</xNome>
      </dest>
      <total>
        <ICMSTot>
          <vNF>1000.00</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
  <protNFe>
    <infProt>
      <chNFe>${chaveNFe}</chNFe>
      <dhRecbto>${new Date().toISOString()}</dhRecbto>
      <nProt>123456789012345</nProt>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`
    }

    /**
     * Gera chave de NFe mock (44 dígitos)
     */
    private generateMockChaveNFe(uf: UF): string {
        const ufCode = this.getUFCode(uf).toString().padStart(2, '0')
        const ano = new Date().getFullYear().toString().slice(-2)
        const mes = (new Date().getMonth() + 1).toString().padStart(2, '0')
        const cnpj = '12345678000190'
        const modelo = '55'
        const serie = '001'
        const numero = Math.floor(Math.random() * 999999).toString().padStart(9, '0')
        const tipoEmissao = '1'
        const codigoNumerico = Math.floor(Math.random() * 99999999).toString().padStart(8, '0')

        // Chave sem DV
        const chaveSemDV = `${ufCode}${ano}${mes}${cnpj}${modelo}${serie}${numero}${tipoEmissao}${codigoNumerico}`

        // Calcula DV (simplificado)
        const dv = this.calculateDV(chaveSemDV)

        return `${chaveSemDV}${dv}`
    }

    /**
     * Calcula dígito verificador da chave (módulo 11)
     */
    private calculateDV(chave: string): string {
        let soma = 0
        let peso = 2

        for (let i = chave.length - 1; i >= 0; i--) {
            soma += parseInt(chave[i]) * peso
            peso = peso === 9 ? 2 : peso + 1
        }

        const resto = soma % 11
        const dv = resto === 0 || resto === 1 ? 0 : 11 - resto

        return dv.toString()
    }

    /**
     * Retorna código numérico da UF
     */
    private getUFCode(uf: UF): number {
        const codes: Record<UF, number> = {
            [UF.AC]: 12, [UF.AL]: 27, [UF.AP]: 16, [UF.AM]: 13,
            [UF.BA]: 29, [UF.CE]: 23, [UF.DF]: 53, [UF.ES]: 32,
            [UF.GO]: 52, [UF.MA]: 21, [UF.MT]: 51, [UF.MS]: 50,
            [UF.MG]: 31, [UF.PA]: 15, [UF.PB]: 25, [UF.PR]: 41,
            [UF.PE]: 26, [UF.PI]: 22, [UF.RJ]: 33, [UF.RN]: 24,
            [UF.RS]: 43, [UF.RO]: 11, [UF.RR]: 14, [UF.SC]: 42,
            [UF.SP]: 35, [UF.SE]: 28, [UF.TO]: 17
        }
        return codes[uf] || 0
    }
}
