// src/database/tenant-datasource.provider.ts
import { Scope, UnauthorizedException } from '@nestjs/common';
import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppJwtService } from '../../core/security/jwt/jwt.service';

import { TenantConnectionManager } from './tenant.connection.manager';


// Supondo que você injete o tid no request via middleware (ex: req.tenantId ou req.tenant?.schema)
type MaybeTenantRequest = Request & {
  tenantId?: string;
  tenant?: { id?: string; schema?: string };
  headers: Record<string, string | string[] | undefined>;
};

export const TENANT_DATA_SOURCE = Symbol('TENANT_DATA_SOURCE');

export const TenantDataSourceProvider: Provider = {
  provide: TENANT_DATA_SOURCE,
  scope: Scope.REQUEST,
  inject: [REQUEST, TenantConnectionManager, AppJwtService],
  useFactory: async (
    req: MaybeTenantRequest,
    mgr: TenantConnectionManager,
    jwt: AppJwtService
  ): Promise<DataSource> => {
    let tokenTid = (req as any)?.user?.tid as string | undefined;

    if (!tokenTid) {
      const authHeader = (req.headers['authorization'] as string) || '';
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        try {
          const payload = await jwt.verifyAccessToken(token);
          (req as any).user = payload;
          tokenTid = payload?.tid;
        } catch (err: any) {
          if (err?.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Token expirado');
          }
          throw new UnauthorizedException('Token invalido');
        }
      }
    }

    const tid = tokenTid;

    if (!tid) {
      throw new UnauthorizedException('Token não identificado');
    }

    const schema = tid;

    return mgr.getOrCreate(schema);
  },
};
