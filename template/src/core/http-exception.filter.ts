import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';
import { ErrorMsg } from 'src/shared/constants';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmFilter implements ExceptionFilter {
	catch(exception: TypeORMError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = HttpStatus.INTERNAL_SERVER_ERROR;
		let { message } = exception;

		response.status(status).json({
			statusCode: status,
			message,
		});
	}
}

@Catch(TypeError)
export class TypeErrorFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = HttpStatus.INTERNAL_SERVER_ERROR;
		let { message } = exception;

		response.status(status).json({
			statusCode: status,
			message,
		});
	}
}

@Catch(AxiosError)
export class AxiosFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = HttpStatus.INTERNAL_SERVER_ERROR;
		let { message } = exception;
		const resp = {};

		if (exception.code === 'ECONNABORTED') {
			resp['info'] = message;
			resp['message'] = 'timeout_external';
		} else {
			resp['info'] = message;
			resp['message'] = 'error_external_server';
		}

		response.status(status).json({
			statusCode: status,
			...resp,
		});
	}
}
