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
import { MediaModule } from './media/module/media.module';
import { MediaService } from './media/service/media.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StoreModule } from './store/module/store.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/public'),
      serveRoot: '/uploads/public',
    }),
    PrismaFilterModule,
    MediaModule,
    StoreModule,
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService, MailService, MediaService],
})
export class AppModule {}
