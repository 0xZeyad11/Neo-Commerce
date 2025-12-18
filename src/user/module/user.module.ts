import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from '../service/user.service';
import { MediaModule } from 'src/media/module/media.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, MediaModule, JwtModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
