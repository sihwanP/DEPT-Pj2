import { Router } from 'express';
import multer from 'multer'; // multer types are installed in backend and root
import path from 'path';
import { uploadFile } from '../controllers/uploadController';

const router = Router();

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, 'uploads/products/');
    },
    filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), uploadFile);

export default router;
