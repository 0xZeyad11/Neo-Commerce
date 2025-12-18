import {
  Controller,
  Req,
  Get,
  Body,
  Post,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/CreateUser.dto';
import { AuthService } from '../service/auth.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDTO } from 'src/user/dto/UpdateUser.dto';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/jwtauth.guard';

const maxTokenAge = 24 * 3600;
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly config: ConfigService,
  ) {}

  @ApiOperation({ description: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Created a new user!' })
  @Post('signup')
  async Signup(
    @Body() user: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authservice.signup(user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: this.config.getOrThrow<string>('NODE_ENV') === 'production',
      maxAge: maxTokenAge * 1000,
      sameSite: 'lax',
    });
    return { message: 'successful signup' };
  }

  @ApiOperation({ description: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Created a new user!' })
  @Post('login')
  async login(
    @Body() user: UpdateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authservice.login(user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: this.config.getOrThrow<string>('NODE_ENV') === 'production',
      maxAge: maxTokenAge * 1000,
      sameSite: 'lax',
    });
    return { message: 'Successful login' };
  }

  @ApiOperation({ description: 'Logout User' })
  @ApiResponse({ status: 200, description: 'User logged out succesful' })
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'logout successful' };
  }

  @ApiOperation({ description: 'Get the current logged in user profile data' })
  @ApiResponse({
    status: 200,
    description: 'Current user data found',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async GetMe(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({ description: "Reset the user's password" })
  @ApiResponse({
    status: 200,
    description: 'Email sent to the user to click and then reset the password',
  })
  @Post('forgot-password')
  async ForgotPassword(@Body('email') email: string, @Req() req: Request) {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    return await this.authservice.forgotPassword(email, url);
  }

  @Post('reset-password')
  async ResetPassword(
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    await this.authservice.resetPassword(token, password);
  }
}
