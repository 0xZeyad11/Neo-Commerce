import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Public } from 'src/common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { profileImageMulterConfig } from 'src/media/config/multer.config';
import { MediaService } from 'src/media/service/media.service';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly mediaService: MediaService,
  ) {}

  @ApiOperation({ description: 'Create a new store' })
  @ApiResponse({
    status: 201,
    description: 'New store created',
    type: CreateStoreDto,
  })
  @Roles('STORE_OWNER', 'ADMIN')
  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Public()
  @Get()
  async findAll() {
    return this.storeService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Roles('ADMIN', 'STORE_OWNER')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    console.log('this the update values => ', updateStoreDto);
    return this.storeService.update(id, updateStoreDto);
  }

  @Roles('ADMIN', 'STORE_OWNER')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }

  @Roles('ADMIN', 'STORE_OWNER')
  @Patch('upload-logo/:id')
  @UseInterceptors(FileInterceptor('file', profileImageMulterConfig))
  async uploadStoreLogo(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const actualImage = await this.mediaService.saveStoreLogo(file);
    const exisiting_store = await this.storeService.findOne(id);
    return await this.storeService.saveStoreLogo(
      exisiting_store.id,
      actualImage,
    );
  }
}
