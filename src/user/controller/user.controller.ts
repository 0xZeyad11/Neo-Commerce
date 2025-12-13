import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'generated/client';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @ApiOperation({ summary: 'Get all the users' })
  @ApiResponse({ status: 200, description: 'Get All users in the system' })
  @Get()
  async GetAllUsers(): Promise<User[]> {
    return await this.userservice.getAllUsers();
  }

  @ApiOperation({ summary: 'Get User By ID' })
  @ApiResponse({ status: 200, description: 'User Found!' })
  @ApiResponse({ status: 404, description: 'User Not Found!' })
  @Get(':id')
  async GetUserByID(@Param('id') id: string): Promise<User> {
    const user = await this.userservice.getUserByID(id);
    if (!user) {
      throw new NotFoundException(`User with the ${id} is not found!`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Delete User By ID' })
  @ApiResponse({ status: 200, description: 'User Deleted!' })
  @Delete(':id')
  async DeleteUserByID(@Param('id') id: string) {
    return await this.userservice.deleteUserByID(id);
  }
}
