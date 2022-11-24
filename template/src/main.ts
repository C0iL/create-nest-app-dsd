import { LogLevel, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AxiosFilter, TypeErrorFilter, TypeOrmFilter } from './core/http-exception.filter';

async function bootstrap() {
	//Variable for current running environment
	const isProd = ['prod', 'preprod'].includes(process.env.NODE_ENV);

	//Set log level depending on environment
	const logger: LogLevel[] = isProd ? ['error', 'warn'] : ['verbose', 'debug'];

	//If DEBUG is set to true in production, start with debug logger
	if (isProd && process.env.DEBUG) logger.push('debug');

	//Initialize the app
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: logger,
	});

	//Configure global validation pipe
	const validationPipe = new ValidationPipe({
		validationError: {
			target: false,
			value: false,
		},
		stopAtFirstError: true,
		whitelist: true,
	});

	//Additional configs
	app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
	app.useGlobalPipes(validationPipe);
	app.use(urlencoded({ extended: true, limit: '5mb' }));
	app.enableCors();

	//Enable api versioning. By default all endpoints will start with /v1 . Disable it if versioning is not necessary.
	app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
	app.useGlobalFilters(new TypeOrmFilter(), new AxiosFilter(), new TypeErrorFilter());

	//API documentation
	//TODO: Don't expose in prod environment
	//Change the values for your project
	const swaggerConfig = {
		title: 'DSD - NestJS starter project',
		description: 'Some description',
		version: '1.0',
		tokenName: 'access_token',
		htmlTitle: 'DSD - API',
	};

	const swaggerDocument = new DocumentBuilder()
		.setTitle(swaggerConfig.title)
		.setDescription(swaggerConfig.description)
		.setVersion(swaggerConfig.version)
		.addBearerAuth({ type: 'http' }, swaggerConfig.tokenName)
		.build();
	const document = SwaggerModule.createDocument(app, swaggerDocument);
	SwaggerModule.setup('doc', app, document, {
		customSiteTitle: swaggerConfig.htmlTitle,
	});

	//Finally start the app
	const port = parseInt(process.env.PORT) || 8080;
	await app.listen(port);
	console.log(`App started on port: ${port} at:`, new Date().toLocaleString());
}
bootstrap();
