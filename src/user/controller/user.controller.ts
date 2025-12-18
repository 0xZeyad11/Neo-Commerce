import {
  Controller,
  Get,
  Param,
  Delete,
  NotFoundException,
  Req,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'generated/client';
import { JwtAuthGuard } from 'src/common/guards/jwtauth.guard';
import { MediaService } from 'src/media/service/media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { profileImageMulterConfig } from 'src/media/config/multer.config';
import type { Request } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userservice: UserService,
    private readonly mediaservice: MediaService,
  ) {}

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

  @ApiOperation({ summary: 'Upload User Profile' })
  @ApiResponse({ status: 201, description: 'Image upload for the user avatar' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', profileImageMulterConfig))
  @Post('upload-avatar')
  async UploadUserAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const image = await this.mediaservice.saveUserProfileImage(file);
    const current_user = req.user as any;
    console.log('this the current user for the uploaded image: ', current_user);
    console.log(current_user.id);
    if (!current_user || !current_user.id) {
      throw new UnauthorizedException(
        `You aren't authorized to do this action`,
      );
    }
    return await this.userservice.saveUserAvatar(current_user.id, image);
  }
}
