import { existsSync, unlinkSync } from 'fs';

class ImageService {
  deleteImage(modelObject, defaultFilePath: string) {
    if (modelObject.image && modelObject.image != defaultFilePath) {
      const filePath = modelObject.image;

      if (existsSync(filePath)) unlinkSync(filePath);
      else console.log('No image in folder.');
    } else {
      console.log('No image field in model object.');
    }
  }
}

export default new ImageService();
