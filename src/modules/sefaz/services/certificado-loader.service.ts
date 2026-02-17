import { Injectable } from "@nestjs/common"
import * as crypto from "crypto"

import { ICertificado } from "modules/certificados/domain/entities/certificado"

export interface PreparedCertificate {
    pfx: Buffer
    passphrase: string
    thumbprint: string
    cnpj: string
    expiresAt: Date
}

@Injectable()
export class CertificadoLoaderService {
    /**
     * Prepara um certificado para uso em requisições SEFAZ
     */
    prepareCertificate(certificado: ICertificado): PreparedCertificate {
        // Validar expiração
        if (certificado.expirationDate < new Date()) {
            throw new Error(`Certificado expirado em ${certificado.expirationDate.toISOString()}`)
        }

        // Descriptografar senha
        const passphrase = this.decryptPassword(certificado.passwordEncrypted)

        return {
            pfx: certificado.binaryFile,
            passphrase,
            thumbprint: certificado.thumbprint,
            cnpj: certificado.cnpj.value,
            expiresAt: certificado.expirationDate
        }
    }

    /**
     * Descriptografa a senha do certificado
     * TODO: Implementar descriptografia real (AES-256)
     */
    private decryptPassword(encryptedPassword: string): string {
        // Por enquanto, retorna a senha como está
        // Em produção, implementar:
        // const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
        // return decipher.update(encryptedPassword, 'hex', 'utf8') + decipher.final('utf8')

        return encryptedPassword
    }

    /**
     * Valida se o certificado pode ser usado
     */
    validateCertificate(certificado: ICertificado): { valid: boolean; reason?: string } {
        // Verificar se está expirado
        if (certificado.expirationDate < new Date()) {
            return { valid: false, reason: "Certificado expirado" }
        }

        // Verificar se está ativo
        if (!certificado.isActive) {
            return { valid: false, reason: "Certificado inativo" }
        }

        // Verificar se tem arquivo binário
        if (!certificado.binaryFile || certificado.binaryFile.length === 0) {
            return { valid: false, reason: "Arquivo do certificado ausente" }
        }

        return { valid: true }
    }
}
