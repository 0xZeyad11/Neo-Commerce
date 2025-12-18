import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import e from 'express';
import { User } from 'generated/client';
import { MailService } from 'src/mail/service/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from 'src/user/dto/CreateUser.dto';
import { UpdateUserDTO } from 'src/user/dto/UpdateUser.dto';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly user: UserService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
  ) {}

  async signup(newuser: CreateUserDTO) {
    const { email, password, avatar, role } = newuser;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('This user already has an account!');
    }
    const hashedPassword = await this.hashPassword(password);
    const userData = {
      email: email,
      password: hashedPassword,
      avatar: avatar,
      role: role ?? 'CUSTOMER',
    };
    const user = await this.user.createUser(userData);
    const token = await this.singToken(user);
    return token;
  }

  async login(info: UpdateUserDTO) {
    const { email, password } = info;
    if (!email || !password) {
      throw new BadRequestException('please provide both email and password');
    }
    const existingUser = await this.prisma.user.findUniqueOrThrow({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!(await this.comparePassword(password, existingUser.password))) {
      throw new UnauthorizedException(
        'invalid password or email, please try again!',
      );
    }

    const token = this.singToken(existingUser);
    return token;
  }

  async forgotPassword(email: string, resetUrl: string) {
    const exisitingUser = await this.user.getUserByEmail(email);
    if (!exisitingUser) {
      throw new BadRequestException(
        'This user does not exist,  please make sure to make an account',
      );
    }
    const payload = { sub: exisitingUser.id, email: exisitingUser.email };
    const reset_token = await this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
    });

    const url = `${resetUrl}?token=${reset_token}`;
    const userEmail = exisitingUser.email as string;
    await this.mail.sendPasswordResetLink(userEmail, url, 'password reset');
    const token_expiry = Date.now() + 600 * 1000; //this is in ms ==> 10 minutes
    const encrypted_token = await this.hashPassword(reset_token);
    await this.prisma.user.update({
      where: { id: exisitingUser.id },
      data: {
        password_reset_token: encrypted_token,
        password_reset_token_expiry: new Date(token_expiry),
        password_updatedAt: new Date(),
      },
    });
  }

  async resetPassword(resetToken: string, password: string) {
    const payload = await this.jwt.verifyAsync(resetToken, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
    const { sub } = payload;
    const existingUser = await this.prisma.user.findUnique({
      where: { id: sub },
      select: {
        email: true,
        id: true,
        password_reset_token: true,
        password_reset_token_expiry: true,
        password_updatedAt: true,
      },
    });
    if (!existingUser?.password_reset_token) {
      throw new BadRequestException(
        'There is no token or already used one , hit the forgot password link again',
      );
    }
    const isTokenMatch = await this.comparePassword(
      resetToken,
      existingUser?.password_reset_token,
    );
    if (!isTokenMatch) {
      throw new BadRequestException(
        'Unverified token please make sure to hit the forgot password link again ',
      );
    }
    const hashedPassword = await this.hashPassword(password);
    return await this.prisma.user.update({
      where: { id: sub },
      data: {
        password: hashedPassword,
        password_reset_token: null,
        password_reset_token_expiry: null,
        password_updatedAt: new Date(),
      },
    });
  }

  private async comparePassword(
    password: string,
    encrypted: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, encrypted);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(this.config.getOrThrow<string>('SALT'));
    return await bcrypt.hash(password, saltRounds);
  }

  async singToken(user: Partial<User>) {
    console.log('this is the sign token and this the user value ', user);
    return this.jwt.signAsync({ sub: user.id, email: user.email });
  }
}
