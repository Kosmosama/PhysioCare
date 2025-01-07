import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const uniqueSuffix = `${timestamp}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${extension}`);
    }
});

const upload = multer({ storage: storage });

/**
 * Delete an image file.
 * @param {string} imageName - The location of the image to delete.
 */
const deleteImage = (imageName) => {
    const fullPath = path.join(process.cwd(), imageName);

    fs.unlink(fullPath, (error) => {
        if (error) {
            console.error(`Failed to delete image at ${fullPath}:`, error);
        }
    });
};

export { upload, deleteImage };