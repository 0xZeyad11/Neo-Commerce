import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
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
    const { email, password, avatar } = newuser;

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
    if (!existingUser) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
    if (!(await this.comparePassword(password, existingUser.password))) {
      throw new UnauthorizedException(
        'invalid password or email, please try again!',
      );
    }

    const token = this.singToken(existingUser);
    return token;
  }

  async resetPassword(email: string, resetUrl: string) {
    const exisitingUser = await this.user.getUserByEmail(email);
    if (!exisitingUser) {
      throw new BadRequestException(
        'This user does not exist,  please make sure to make an account',
      );
    }
    const payload = { sub: exisitingUser.id, email: exisitingUser.email };
    const reset_token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
    });

    const url = `${resetUrl}?token=${reset_token}`;
    const userEmail = exisitingUser.email as string;
    await this.mail.sendPasswordResetLink(userEmail, url, 'password reset');
    const token_expiry = Date.now() + 3600 * 1000; //this is in ms
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
