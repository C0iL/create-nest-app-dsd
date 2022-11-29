import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class ReferenceService {
	constructor(private readonly config: ConfigService, private readonly httpService: HttpService) {
		this.baseUrl = this.config.get<string>('EXT_APP');
	}

	private baseUrl: string;

	async getGenres() {
		const path = `/reference/genres`;
		return this.getFromExternalService(path, null);
	}

	private async getFromExternalService(path: string, params: any) {
		const obs = this.httpService
			.get(`${this.baseUrl}${path}`, {
				params,
			})
			.pipe(map((resp) => resp.data));

		return firstValueFrom(obs);
	}
}
