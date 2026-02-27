import { Money } from "core/valueObjects"
import type { ValueTransformer } from "typeorm"

export const moneyTransformer: ValueTransformer = {
    to:(value: Money | string | null | undefined): string | null => {
        if (value == null) return null
        if (typeof value === "string") return value
        return value.amount
    },
    from:(dbValue: unknown): Money | null => {
        if (dbValue == null) return null
        const str = String(dbValue)
        return new Money(str, "BRL", 2)
    }
}
