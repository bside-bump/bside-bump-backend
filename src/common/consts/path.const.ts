import { join } from 'path';

export const PROJECT_ROOT_PATH = process.cwd();
export const PUBLIC_FOLDER_NAME = 'public';
const IMAGES_FOLDER_NAME = 'images';
export const PRODUCTS_FOLDER_NAME = 'products';

// 공개 폴더 절대 경로
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);
export const IMAGES_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, IMAGES_FOLDER_NAME);

// 아이템 대표 이미지를 저장할 폴더
export const PRODUCTS_IMAGE_PATH = join(
  IMAGES_FOLDER_PATH,
  PRODUCTS_FOLDER_NAME,
);
