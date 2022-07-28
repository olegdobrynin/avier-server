import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

export const getDirname = (url) => dirname(fileURLToPath(url));

export const buildImgPath = (folder, name) => {
  const __dirname = getDirname(import.meta.url);
  return resolve(__dirname, '..', '..', 'static', folder, name);
};
