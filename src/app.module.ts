import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/module/user.module';
import { UserController } from './user/controller/user.controller';
import { UserService } from './user/service/user.service';
import { AuthModule } from './auth/module/auth.module';
import { AuthService } from './auth/service/auth.service';
import { AuthController } from './auth/controller/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaFilterModule } from './common/filters/PrismaFilter/prisma-filter.module';
import { MailModule } from './mail/module/mail.module';
import { MailService } from './mail/service/mail.service';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    MailModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['local.env'],
    }),
    PrismaFilterModule,
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService, MailService],
})
export class AppModule {}
