import { Bucket, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'path';
import * as sharp from 'sharp';
import storageConfig from '../shared/cloud/google-storage.config';

@Injectable()
export class CloudStorageService {
	private bucket: Bucket;
	private storage: Storage;

	constructor() {
		this.storage = new Storage({
			projectId: storageConfig.project_id,
			credentials: {
				client_email: storageConfig.client_email,
				private_key: storageConfig.private_key,
			},
		});
		this.bucket = this.storage.bucket('BUCKET_NAME');
	}

	private setDestination(destination: string): string {
		let escDestination = '';
		escDestination += destination.replace(/^\.+/g, '').replace(/^\/+|\/+$/g, '');
		if (escDestination !== '') escDestination = escDestination + '/';
		return escDestination;
	}

	private setFilename(uploadedFile: Express.Multer.File): string {
		const fileName = parse(uploadedFile.originalname);
		return `${Math.round(Math.random() * 1e12)}-${Date.now()}${fileName.ext}`
			.replace(/^\.+/g, '')
			.replace(/^\/+/g, '')
			.replace(/\r|\n/g, '_');
	}

	async uploadFile(
		fileToUpload: Express.Multer.File,
		destination: string,
		processImage?: boolean
	) {
		const buffer = processImage ? await this.processImage(fileToUpload) : fileToUpload.buffer;
		const fileName = this.setDestination(destination) + this.setFilename(fileToUpload);
		const file = this.bucket.file(fileName);
		try {
			await file.save(buffer, {
				contentType: fileToUpload.mimetype,
			});
		} catch (error) {
			throw new BadRequestException(error?.message);
		}
		return {
			...file.metadata,
		};
	}

	async removeFile(fileName: string): Promise<void> {
		const file = this.bucket.file(fileName);
		try {
			await file.delete();
		} catch (error) {
			throw new BadRequestException(error?.message);
		}
	}

	private async processImage(image: Express.Multer.File): Promise<Buffer> {
		const buffer = await sharp(image.buffer)
			.resize({ width: 300, withoutEnlargement: true })
			.toBuffer();
		return buffer;
	}
}
