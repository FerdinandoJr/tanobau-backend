// src/security/password/password.module.ts
import { Module } from '@nestjs/common';

import { Pbkdf2PasswordHasher } from './password-hasher.service';
import { PasswordPolicyService } from './password-policy.service';
// troque Pbkdf2PasswordHasher por FakePasswordHasher em testes

@Module({
  providers: [
    PasswordPolicyService,
    { provide: 'PasswordHasher', useClass: Pbkdf2PasswordHasher },
  ],
  exports: ['PasswordHasher', PasswordPolicyService],
})
export class PasswordModule {}
