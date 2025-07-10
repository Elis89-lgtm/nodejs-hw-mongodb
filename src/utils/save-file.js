import { saveFileToCloudinary } from './save-file-to-cloudinary.js';

export const saveFile = async (file) => {
  return await saveFileToCloudinary(file);
};
