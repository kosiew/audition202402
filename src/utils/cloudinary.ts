import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConfig = process.env.CLOUDINARY_CONFIG;
if (!cloudinaryConfig) {
  throw new Error('CLOUDINARY_CONFIG is not defined in .env');
}

try {
  const configOptions = JSON.parse(cloudinaryConfig);
  cloudinary.config(configOptions);
} catch (error) {
  console.error('Failed to parse CLOUDINARY_CONFIG:', error);
  throw new Error('Failed to parse CLOUDINARY_CONFIG');
}

export default cloudinary;
