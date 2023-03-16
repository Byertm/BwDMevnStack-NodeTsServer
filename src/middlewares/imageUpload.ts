import { Request } from 'express';
import multer from 'multer';
import { FILE_MAX_SIZE, UPLOAD_DIR } from '@/config/config';

const allowedMimeTypes = ['image/bmp', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/tiff', 'image/svg+xml'];

const storage: multer.StorageEngine = multer.diskStorage({
	destination: function (_: Request, __: Express.Multer.File, cb: (error: Error, destination: string) => void) {
		cb(null, UPLOAD_DIR);
	},
	filename: function (_: Request, file: Express.Multer.File, cb: (error: Error, filename: string) => void) {
		const randomName = `${Date.now()}_${Math.random().toString(36)}_${file.fieldname}_${file.originalname.trim()}`;
		// console.log('randomFileName', randomName);
		cb(null, randomName);
	}
});

const fileFilter = (_: Request, file: Express.Multer.File, cb: (err: Error | null, bool: boolean) => void) => {
	console.log('Multer Info: ', { file, Req: _ });

	if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
	else return cb(new Error('Desteklenmeyen Dosya Biçimi'), false);
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: FILE_MAX_SIZE } });

export { upload };

export default upload;