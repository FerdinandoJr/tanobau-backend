import { SefazDocument } from "modules/sefazDocument/domain/entities/sefaz-document"
import { FinancialInstallmentsStatus } from "../valueObjects/financial-installments-status.enum"

export interface FinancialInstallments {
    id: number
    installmentNumber: string | null
    dueDate: Date | null
    expectedValue: number | null
    paidValue: number | null
    status: FinancialInstallmentsStatus | null
    paidAt: Date | null
    paymentMethod: string | null
    barcode: string | null
    observation: string | null
    document: SefazDocument | null
}