import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

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

// const deleteImage = (relativePath) => {
//     const fullPath = path.join(process.cwd(), relativePath);
//     fs.unlink(fullPath, (err) => {
//         if (err) {
//             console.error(`Failed to delete image at ${fullPath}:`, err);
//         } else {
//             console.log(`Image at ${fullPath} deleted successfully.`);
//         }
//     });
// };

// export { upload, deleteImage };
export default upload;
