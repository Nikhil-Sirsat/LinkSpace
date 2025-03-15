import { v2 as cloudinary } from 'cloudinary';

export const delImgFromCloud = async (url) => {
    try {
        const publicId = url.split('/').pop().split('.')[0]; // Extract public_id from URL

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(`LinkSpace_Posts/${publicId}`);
    } catch (err) {
        console.error(err);
    }
}