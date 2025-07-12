import { saveFileToCloudinary } from './save-file-to-cloudinary.js';

export const saveFile = async (file) => {
  console.log(file);

  return await saveFileToCloudinary(file);
};
