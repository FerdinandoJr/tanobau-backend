import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SortByPipe<K> implements PipeTransform<string | undefined, K> {
  constructor(
    private readonly defaultKey: K,
    private readonly allowedKeys: readonly K[],
  ) {}

  transform(value?: string, _metadata?: ArgumentMetadata): K {
    if (!value) return this.defaultKey
    
    if (this.allowedKeys.includes(value as K)) {
      return value as K;
    }

    throw new BadRequestException(
      `Invalid sortBy value: ${value}. Allowed: ${this.allowedKeys.join(', ')}`
    );
  }
}
