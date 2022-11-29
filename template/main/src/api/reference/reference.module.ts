import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReferenceController } from './reference.controller';
import { ReferenceService } from './reference.service';

@Module({
	imports: [
		HttpModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				timeout: config.get<number>('EXT_TIMEOUT') ?? 10000,
				maxRedirects: 5,
			}),
		}),
	],
	controllers: [ReferenceController],
	providers: [ReferenceService],
	exports: [ReferenceService],
})
export class ReferenceModule {}
