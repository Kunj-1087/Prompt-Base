
import { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/AppError';
import { sendResponse } from '../utils/response';
import fs from 'fs';

// Configure Cloudinary
// Note: User needs to ensure these are in .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer (Temp storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure 'uploads' dir exists or use tmp
    const dir = './uploads';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

// Filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP and PDF are allowed.'));
    }
};

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: fileFilter
});

// @desc    Upload file
// @route   POST /api/v1/upload
// @access  Private
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        throw new AppError('No file uploaded', 400);
    }

    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'prompt-base/uploads',
            resource_type: 'auto'
        });

        // Cleanup local file
        fs.unlinkSync(req.file.path);

        sendResponse(res, 200, 'File uploaded successfully', {
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            resource_type: result.resource_type
        });
    } catch (error) {
        // Cleanup if error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Cloudinary Upload Error:', error);
        throw new AppError('File upload failed', 500);
    }
};
