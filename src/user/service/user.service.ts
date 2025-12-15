import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from '../dto/CreateUser.dto';
import { User } from 'generated/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: CreateUserDTO): Promise<User> {
    return await this.prisma.user.create({ data: user });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserByID(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  async getUserByEmail(email: string): Promise<User | Partial<User>> {
    try {
      console.log(
        'this is the value of email we got in the find user by email here >  ',
        email,
      );
      const existingUser = await this.prisma.user.findUniqueOrThrow({
        where: { email: email },
      });
      return existingUser;
    } catch (error) {
      console.error('Error in getUserByEmail:', error); // log the actual error
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }

  async deleteUserByID(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }
}
