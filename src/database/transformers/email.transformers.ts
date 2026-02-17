import type { ValueTransformer } from 'typeorm';

import { Email } from '../../core/valueObjects/email';

export const emailTransformer: ValueTransformer = {
  to: (email?: Email | null): string | null =>
    email ? email.value : null,
  from: (value?: string | null): Email | null =>
    value ? new Email(value) : null,
};
