import { Module } from '@nestjs/common';
import { MediaService } from '../service/media.service';

@Module({ providers: [MediaService], exports: [MediaService] })
export class MediaModule {}
