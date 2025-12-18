import { Injectable, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { ProcessImage } from '../image.processor';

type MediaType = { type: string; path: string };

@Injectable()
export class MediaService {
  private async ensureDir(path: string) {
    await mkdir(path, { recursive: true });
  }

  async saveUserProfileImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const outputDir = join(process.cwd(), '/uploads/public/users');
    await this.ensureDir(outputDir);
    const processed = await ProcessImage(file.buffer, 256, 256);
    const filename = `${randomUUID()}.webp`;
    const filepath = join(outputDir, filename);
    await writeFile(filepath, processed);
    return `/uploads/public/users/${filename}`;
  }

  async saveProductMedia(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    if (files.length > 4) {
      throw new BadRequestException('Max 4 media files allowed');
    }
    const outputDir = join(process.cwd(), '/uploads/public/products');
    await this.ensureDir(outputDir);

    const results: MediaType[] = [];
    for (const file of files) {
      const isImage = file.mimetype.startsWith('image/');
      const isVideo = file.mimetype.startsWith('video/');
      if (isImage) {
        const processed = await ProcessImage(file.buffer, 1024, 1024);
        const filename = `${randomUUID()}.webp`;
        const filepath = join(outputDir, filename);
        await writeFile(filepath, processed);
        results.push({
          type: 'image',
          path: `/uploads/public/products/${filename}`,
        });
      }

      if (isVideo) {
        const ext = file.originalname.split('.').pop();
        const filename = `${randomUUID()}.${ext}`;
        await writeFile(join(outputDir, filename), file.buffer);
        results.push({
          type: 'video',
          path: `/uploads/public/products/${filename}`,
        });
      }
    }
    return results;
  }
}
