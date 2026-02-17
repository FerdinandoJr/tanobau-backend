export enum DocumentStatus {
    PENDING = "pending",        // Nota recebida/identificada, mas XML ainda não baixado
    AUTHORIZED = "authorized",  // XML baixado e validado (equivale ao seu 'sent')
    CANCELED = "canceled",      // Nota cancelada na SEFAZ
    DENEGATED = "denegated",    // Problema fiscal com o emitente/destinatário
    ERROR = "error"             // Falha ao processar o XML ou erro de assinatura
}