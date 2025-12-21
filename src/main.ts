import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptors';
import { PrismaExceptionFilter } from './common/filters/PrismaFilter/prismaException.filter';
import cookieParser from 'cookie-parser';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwtauth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000/',
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(app.get(PrismaExceptionFilter));
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  const config = new DocumentBuilder()
    .setTitle('NEO Commerce')
    .setDescription('Headless E-Commerce Builder')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
