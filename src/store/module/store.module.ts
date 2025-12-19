import { Module } from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { StoreController } from '../controller/store.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MediaModule } from 'src/media/module/media.module';

@Module({
  imports: [PrismaModule, JwtModule, MediaModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
