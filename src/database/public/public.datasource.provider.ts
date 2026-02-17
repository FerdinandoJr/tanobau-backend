import { Provider } from '@nestjs/common'

import PublicDataSource from './public.datasource';

export const PUBLIC_DATA_SOURCE = Symbol('PUBLIC_DATA_SOURCE');

export const PublicDataSourceProvider: Provider = {
  provide: PUBLIC_DATA_SOURCE,
  useFactory: async () => {
    const ds = PublicDataSource

    // Só inicializa uma vez
    if (!ds.isInitialized) {
      await ds.initialize()
    }
    return ds
  },
}
