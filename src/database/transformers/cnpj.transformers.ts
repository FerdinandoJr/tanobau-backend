import { CNPJ } from 'core/valueObjects/cnpj'
import type { ValueTransformer } from 'typeorm'

export const cnpjTransformer: ValueTransformer = {
  to: (cnpj?: CNPJ | null): string | null =>
    cnpj ? cnpj.value : null,
  from: (value?: string | null): CNPJ | null =>
    value ? new CNPJ(value) : null,
}
