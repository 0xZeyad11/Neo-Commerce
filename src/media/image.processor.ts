import sharp from 'sharp';

export async function ProcessImage(
  file: Buffer,
  width: number,
  height: number,
) {
  return sharp(file)
    .resize(width, height, {
      fit: 'cover',
      withoutEnlargement: true,
    })
    .toFormat('webp')
    .webp({ quality: 80 })
    .toBuffer();
}
