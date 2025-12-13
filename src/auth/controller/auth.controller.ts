import { Controller, Get, Body, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/CreateUser.dto';
import { AuthService } from '../service/auth.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDTO } from 'src/user/dto/UpdateUser.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @ApiOperation({ description: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Created a new user!' })
  @Post()
  async Signup(@Body() user: CreateUserDTO) {
    return await this.authservice.signup(user);
  }

  @ApiOperation({ description: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Created a new user!' })
  @Post('login')
  async login(@Body() user: UpdateUserDTO) {
    return await this.authservice.login(user);
  }
}
