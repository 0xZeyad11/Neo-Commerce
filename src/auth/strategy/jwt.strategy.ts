/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = config.getOrThrow<string>('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req.cookies && req.cookies.access_token) {
            return req.cookies.access_token;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    console.log('Welcome from the validate function ');
    console.log(payload);
    const { sub, email } = payload;
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: sub },
    });
    if (!user) {
      console.log("Can't find this user ");
      throw new UnauthorizedException(
        "This user doesn't exist, please make sure to make an account",
      );
    }
    return user;
  }
}
