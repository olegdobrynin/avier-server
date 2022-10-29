import fsp from 'node:fs/promises';
import resizeImage from './resize.js';
import { uploadImageToAWS, removeImageFromAWS } from '../aws/aws.js';
import { buildImgPath } from './paths.js';

export const uploadImage = async (img, folder, imgName) => {
  const resizedImage = await resizeImage(img);

  return process.env.NODE_ENV === 'production'
    ? uploadImageToAWS(resizedImage, folder, imgName)
    : fsp.writeFile(buildImgPath(folder, imgName), resizedImage);
};

export const removeImage = async (folder, imgName) => (process.env.NODE_ENV === 'production'
  ? removeImageFromAWS(folder, imgName)
  : fsp.rm(buildImgPath(folder, imgName)));
