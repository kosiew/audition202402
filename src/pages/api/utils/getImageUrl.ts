import cloudinary from '@/utils/cloudinary';
import { Files } from 'formidable';
import { NextApiResponse } from 'next';

export async function getImageUrl(files: Files, res: NextApiResponse) {
  let imageUrl = '';
  if (files.file) {
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (file.filepath) {
      try {
        const result = await cloudinary.uploader.upload(file.filepath);
        imageUrl = result.url; // Set the Cloudinary image URL
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }
  }
  return imageUrl;
}
