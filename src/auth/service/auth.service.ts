import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
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
  ) {}

  async signup(newuser: CreateUserDTO) {
    //TODO: add a default png for the avatar if the user
    const { email, password, avatar } = newuser;

    //Check if the user already exists!
    const existingUser = await this.user.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('This user already has an account!');
    }

    const hashedPassword = await this.hashPassword(password);
    const userData = {
      email: email,
      password: hashedPassword,
      avatar: avatar,
    };
    return await this.user.createUser(userData);
  }

  async login(info: UpdateUserDTO) {
    const { email, password } = info;
    if (!email || !password) {
      throw new BadRequestException('please provide both email and password');
    }
    const existingUser = await this.prisma.user.findFirst({
      where: { email },
      select: { password: true, email: true },
    });
    if (!existingUser) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
    if (!(await this.comparePassword(password, existingUser.password))) {
      throw new UnauthorizedException(
        'invalid password or email, please try again!',
      );
    }

    const { password: newpass, ...rest } = existingUser;
    return rest;
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
}
