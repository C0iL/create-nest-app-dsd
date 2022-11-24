import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import { ErrorMsg } from '../constants';

export const multerConfig: MulterOptions = {
	storage: memoryStorage(),
	limits: {
		fileSize: Number(process.env.IMG_SIZE) > 0 ? Number(process.env.IMG_SIZE) : 5000000,
		files: 1,
	},
	fileFilter: (req, file, callback) => {
		return file.mimetype.match(/image\/(jpg|jpeg|png)$/)
			? callback(null, true)
			: callback(new BadRequestException(ErrorMsg.INVALID_FILE_TYPE), false);
	},
};
