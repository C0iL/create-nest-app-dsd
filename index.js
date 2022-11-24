#!/usr/bin/env node

let shell = require('shelljs');
require('colors');
const path = require('node:path');

let fs = require('fs');
let child_process = require('node:child_process');

let appName = process.argv[2];
// let appDirectory = path.join(process.cwd()?.toString(), appName);

const createNestApp = () => {
	return new Promise((resolve) => {
		if (appName) {
			const dirExists = shell.test('-d', appName);
			if (dirExists) {
				console.log('\nПрожектын нэр давхцаж байна. Өөр нэр оруулна уу!'.red);
				return;
			}
			const nestIsInstalled = shell.which('nest');
			if (!nestIsInstalled) {
				console.log('NestJS CLI tool суулгаж байна. Түр хүлээнэ үү...'.yellow);
				shell.exec(`npm i -g @nestjs/cli`, () => {
					console.log('\nNestJS CLI tool суулгаж дууслаа.'.green);
					startNestCLI(appName, shell.which('nest').stdout);
					resolve(true);
				});
			} else {
				startNestCLI(appName, nestIsInstalled.stdout);
				resolve(true);
			}
		} else {
			console.log('\nПрожектын нэр хоосон байна!'.red);
			console.log('\nДоорх байдлаар нэр оруулна уу: ');
			console.log('\ncreate-nest-app-dsd', 'app-name\n'.cyan);
			resolve(false);
		}
	});
};

const cdIntoApp = (appName) => {
	shell.cd(appName);
};

const editScripts = () => {
	try {
		const fileName = 'package.json';
		const jsonToEdit = JSON.parse(fs.readFileSync(fileName));
		const scriptsToEdit = [
			{ key: 'start', value: 'cross-env NODE_ENV=dev' },
			{ key: 'start:dev', value: 'cross-env NODE_ENV=dev' },
			{ key: 'start:debug', value: 'cross-env NODE_ENV=dev' },
			{ key: 'start:prod', value: 'cross-env NODE_ENV=prod' },
		];
		for (const script of scriptsToEdit) {
			const currentScript = jsonToEdit.scripts?.[script.key];
			const newScript = !currentScript.includes('cross-env')
				? `${script.value} ${currentScript}`
				: currentScript;
			if (currentScript) jsonToEdit.scripts[script.key] = newScript;
		}
		fs.writeFileSync(fileName, JSON.stringify(jsonToEdit, null, 2));
	} catch (error) {
		console.log("Couldn't edit scripts inside package.json :(".yellow);
	}
};

const installPackages = () => {
	const isUsingPnpm = shell.test('-f', `pnpm-lock.yaml`);
	const isUsingYarn = shell.test('-f', `yarn.lock`);

	const pacMan = isUsingPnpm ? 'pnpm' : isUsingYarn ? 'yarn' : 'npm';
	const installCmd = isUsingYarn ? 'add' : 'install';
	const devFlag = isUsingYarn ? '--dev' : '-D';

	const mainPackages =
		'@google-cloud/storage @nestjs-modules/mailer @nestjs/config @nestjs/axios @nestjs/jwt @nestjs/mapped-types @nestjs/passport @nestjs/swagger @nestjs/typeorm axios bcryptjs cache-manager class-sanitizer class-transformer class-validator handlebars helmet nodemailer passport passport-http passport-jwt passport-local password-validator pg sharp typeorm';
	const devPackages =
		'@types/cache-manager @types/multer @types/nodemailer @types/passport-http @types/passport-jwt @types/passport-local cross-env';

	console.log('Нэмэлт package-ууд суулгаж байна. Түр хүлээнэ үү...'.cyan);
	shell.exec(`${pacMan} ${installCmd} ${mainPackages}`);
	console.log('Dev package-ууд суулгаж байна. Түр хүлээнэ үү...'.cyan);
	shell.exec(`${pacMan} ${installCmd} ${devFlag} ${devPackages}`);
};

const addTemplateFiles = () => {
	shell.cp('-R', path.join(__dirname, 'template', '*'), `${appName}`);
	shell.cp(path.join(__dirname, 'template', '.dev.env'), path.join(`${appName}`, '.dev.env'));
	shell.cp(path.join(__dirname, 'template', '.prod.env'), path.join(`${appName}`, '.prod.env'));
};

const filesToRemove = ['app.controller.spec.ts', 'app.controller.ts', 'app.service.ts'];

const cleanUp = () => {
	for (const file of filesToRemove) {
		const filePath = path.join(appName, 'src', file);
		if (shell.test('-f', filePath)) shell.rm(filePath);
	}
};

const startNestCLI = (appName, nestPath) => {
	try {
		child_process.execFileSync(nestPath, ['new', `${appName}`], {
			stdio: 'inherit',
		});
		addTemplateFiles();
		cdIntoApp(appName);
		installPackages();
		editScripts();
		cleanUp();
		console.log(`\n${appName} project амжилттай үүслээ`.cyan);
		console.log('\nREADME.md файлыг нээж зааврын дагуу тохиргоонуудыг хийнэ үү'.green);
	} catch (error) {
		console.log(`'NestJS прожект үүсгэхэд алдаа гарлаа: ' ${error}`.red);
	}
};

const run = async () => {
	let success = await createNestApp();
	if (!success) {
		console.log('NestJS прожект үүсгэхэд алдаа гарлаа!'.red);
		return false;
	}
};

run();
