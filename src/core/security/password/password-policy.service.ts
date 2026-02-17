import { Injectable } from '@nestjs/common';

export interface PasswordPolicyResult {
  ok: boolean;
  reasons: string[];
}

@Injectable()
export class PasswordPolicyService {
  validate(password: string): PasswordPolicyResult {
    const reasons: string[] = [];
    if (password.length < 8) reasons.push('Mínimo de 8 caracteres.');
    if (!/[A-Z]/.test(password)) reasons.push('Ao menos 1 letra maiúscula.');
    if (!/[a-z]/.test(password)) reasons.push('Ao menos 1 letra minúscula.');
    if (!/[0-9]/.test(password)) reasons.push('Ao menos 1 dígito.');
    if (!/[^A-Za-z0-9]/.test(password)) reasons.push('Ao menos 1 símbolo.');
    return { ok: reasons.length === 0, reasons };
  }
}
