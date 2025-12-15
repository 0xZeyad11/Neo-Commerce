import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from 'generated/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(private readonly config: ConfigService) {}
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let statusCode = 400;
    let message = 'Something went wrong';

    switch (exception.code) {
      case 'P2002':
        message = 'A record with this value already exists!';
        statusCode = 409;
        break;
      case 'P2025':
        message = 'Record not found!';
        statusCode = 404;
        break;
    }
    const isDev = this.config.get<string>('NODE_ENV') === 'development';
    if (isDev) {
      console.log('Prisma Error Stack', exception.stack);
    }
    response.status(statusCode).json({
      status: statusCode,
      message,
      ...(isDev ? { stack: exception.stack } : {}),
    });
  }
}
