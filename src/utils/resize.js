import sharp from 'sharp';

export default (file) => sharp(file)
  .resize({
    width: 1500,
    height: 1500,
    fit: 'inside',
    withoutEnlargement: true,
  })
  .jpeg({ mozjpeg: true })
  .toBuffer();
