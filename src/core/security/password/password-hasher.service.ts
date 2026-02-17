// src/security/password/password-hasher.service.ts
import { randomBytes, pbkdf2 as pbkdf2Cb } from 'crypto';
import { promisify } from 'util';

import { Injectable } from '@nestjs/common';

import { PasswordHasher } from './password-hasher';

const pbkdf2 = promisify(pbkdf2Cb);

// formato: pbkdf2$iter$salt$hash
@Injectable()
export class Pbkdf2PasswordHasher implements PasswordHasher {
  private readonly iterations = 120_000;
  private readonly keylen = 32; // 256 bits
  private readonly digest = 'sha256';

  async hash(plain: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derived = await pbkdf2(plain, salt, this.iterations, this.keylen, this.digest);
    return `pbkdf2$${this.iterations}$${salt}$${derived.toString('hex')}`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    const [alg, itStr, salt, hex] = hashed.split('$');
    if (alg !== 'pbkdf2') return false;
    const iterations = parseInt(itStr, 10);
    const derived = await pbkdf2(plain, salt, iterations, Buffer.from(hex, 'hex').length, this.digest);
    return derived.toString('hex') === hex;
  }
}
