import { Request, Response } from 'express';
import path from 'path';

export const uploadFile = (req: Request & { file?: any }, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the path that can be used to access the file
        const fileUrl = `/uploads/products/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
