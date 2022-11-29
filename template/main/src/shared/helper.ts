import { UnsupportedMediaTypeException } from '@nestjs/common';
import { User } from 'src/api/user/user.entity';
import { ErrorMsg } from './constants';

export class Helper {
	static customFileName(req, file, cb) {
		let suffix = Math.round(Math.random() * 1e12) + '' + Date.now();
		let fileExt;

		if (file.mimetype.indexOf('jpeg') > -1) {
			fileExt = 'jpg';
		}
		if (file.mimetype.indexOf('png') > -1) {
			fileExt = 'png';
		}

		!fileExt
			? cb(new UnsupportedMediaTypeException(ErrorMsg.INVALID_IMG))
			: cb(null, suffix + '.' + fileExt);
	}

	static toUser(decoded: any): User {
		const converted = new User();
		Object.keys(decoded).map((key) => {
			converted[key] = decoded[key];
		});
		return converted;
	}
}
