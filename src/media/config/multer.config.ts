import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const profileImageMulterConfig = {
  storage: memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(
        new BadRequestException('Profile image should be an image'),
        false,
      );
    }
    cb(null, true);
  },
};

export const ProductMediaMulterConfig = {
  storage: memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024,
    files: 4,
  },
  fileFilter: (_req, file, cb) => {
    const allowed =
      file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    if (!allowed) {
      return cb(
        new BadRequestException('Only images and videos are allowed'),
        false,
      );
    }
    cb(null, true);
  },
};
