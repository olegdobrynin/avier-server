import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from './config.js';

export const uploadImageToAWS = async (body, folder, name) => {
  const payload = { Body: body, Key: `${folder}/${name}`, Bucket: process.env.AWS_BUCKET_NAME };
  const putCommand = new PutObjectCommand(payload);

  return s3.send(putCommand);
};

export const removeImageFromAWS = async (folder, name) => {
  const payload = { Key: `${folder}/${name}`, Bucket: process.env.AWS_BUCKET_NAME };
  const delCommand = new DeleteObjectCommand(payload);

  return s3.send(delCommand);
};
