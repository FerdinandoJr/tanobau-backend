import type { ValueTransformer } from 'typeorm';

import { CPF } from 'modules/companies/domain/valueObjects/cpf';

export const cpfTransformer: ValueTransformer = {
  to: (cpf?: CPF | null): string | null =>
    cpf ? cpf.value : null,
  from: (value?: string | null): CPF | null =>
    value ?  new CPF(value) : null,
};
