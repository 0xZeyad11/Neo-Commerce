import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/client';

const globalOmitConfig = {
  user: {
    password: true,
    password_reset_token: true,
    password_reset_token_expiry: true,
    password_updatedAt: true,
  },
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ omit: globalOmitConfig });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
