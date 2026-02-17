import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

export type SortDir = 'ASC' | 'DESC'

@Injectable()
export class SortDirPipe implements PipeTransform<string | undefined, SortDir> {
    transform(value?: string, metadata?: ArgumentMetadata): SortDir {        
      if (!value) return 'ASC'
      
      const val = value.toLowerCase();
      if (val === 'asc') return 'ASC'
      if (val === 'desc') return 'DESC'

      throw new BadRequestException("Invalid sortDir value")
    }
}