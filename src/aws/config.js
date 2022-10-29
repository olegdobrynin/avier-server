import { S3Client } from '@aws-sdk/client-s3';

export default new S3Client({
  endpoint: 'https://s3.storage.selcloud.ru',
  forcePathStyle: true,
  region: 'ru-1',
});
