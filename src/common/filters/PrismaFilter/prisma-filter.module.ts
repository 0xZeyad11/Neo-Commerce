import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaExceptionFilter } from './prismaException.filter';

@Module({
  imports: [ConfigModule],
  providers: [PrismaExceptionFilter],
  exports: [PrismaExceptionFilter],
})
export class PrismaFilterModule {}
