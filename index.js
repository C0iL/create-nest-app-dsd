#!/usr/bin/env node

import inquirer from 'inquirer';
import shell from 'shelljs';
import 'colors';
import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as child_process from 'node:child_process';
import * as fs from 'fs';

let appName = process.argv[2];

const DbType = {
	MySQL: 'mysql',
	PostgreSQL: 'postgresql',
};

const Path = {
	TEMPLATE: 'template',
	MAIN: 'main',
	SOURCE: 'src',
	MySQL: 'mysql',
	PackageJSON: 'package.json',
};

const Env = {
	DEV: '.dev.env',
	PROD: '.prod.env',
};

const PacMan = {
	NPM: 'npm',
	YARN: 'yarn',
	PNPM: 'pnpm',
};

const LockFile = {
	YARN: 'yarn.lock',
	PNPM: 'pnpm-lock.yaml',
};

const DbPackage = {
	MySQL: 'mysql2',
	PostgreSQL: 'pg',
};

const MESSAGES = {
	CHOOSE_DB: 'Database төрлөө сонгоно уу...',
	PACKAGE_INSTALLATION_IN_PROGRESS: 'Нэмэлт package-ууд суулгаж байна.',
	DEV_PACKAGE_INSTALLATION_IN_PROGRESS: 'Dev package-ууд суулгаж байна.',
	NEST_CLI_INSTALLATION_IN_PROGRESS: 'NestJS CLI tool суулгаж байна.',
	PROJECT_SUCCESSFULLY_CREATED: 'project амжилттай үүслээ',
	INSTRUCTION_POST_INSTALLATION: 'README.md файлыг нээж зааврын дагуу тохиргоонуудыг хийнэ үү',
	INSTRUCTION_NAME_INPUT: 'Доорх байдлаар нэр оруулна уу',
	ERROR: 'NestJS прожект үүсгэхэд алдаа гарлаа',
	ERROR_SCRIPT: 'package.json доторх script-үүдийг засч чадсангүй :(',
	ERROR_NAME_EMPTY: 'Прожектын нэр хоосон байна',
};

const scriptNewValues = [
	{ key: 'start', value: 'cross-env NODE_ENV=dev' },
	{ key: 'start:dev', value: 'cross-env NODE_ENV=dev' },
	{ key: 'start:debug', value: 'cross-env NODE_ENV=dev' },
	{ key: 'start:prod', value: 'cross-env NODE_ENV=prod' },
];

const filesToRemove = [
	'test',
	path.join(Path.SOURCE, 'app.controller.spec.ts'),
	path.join(Path.SOURCE, 'app.controller.ts'),
	path.join(Path.SOURCE, 'app.service.ts'),
];

const mainPackages =
	'@google-cloud/storage @nestjs-modules/mailer @nestjs/config @nestjs/axios @nestjs/jwt @nestjs/mapped-types @nestjs/passport @nestjs/swagger @nestjs/typeorm axios bcryptjs cache-manager class-sanitizer class-transformer class-validator handlebars helmet nodemailer passport passport-http passport-jwt passport-local password-validator sharp typeorm';
const devPackages =
	'@types/cache-manager @types/multer @types/nodemailer @types/passport-http @types/passport-jwt @types/passport-local cross-env';

const spinner = (msg) => {
	return ora({
		spinner: {
			interval: 120,
			frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸'],
		},
		text: msg,
	});
};

let insideProject = false;

const createNestApp = async () => {
	return new Promise(async (resolve) => {
		if (appName) {
			const dirExists = shell.test('-d', appName);
			if (dirExists) {
				console.log('\nПрожектын нэр давхцаж байна. Өөр нэр оруулна уу!'.red);
				return;
			}
			const nestIsInstalled = shell.which('nest');
			if (!nestIsInstalled) {
				console.log('NestJS CLI tool суулгаж байна. Түр хүлээнэ үү...'.yellow);
				shell.exec(`npm i -g @nestjs/cli`, async () => {
					console.log('\nNestJS CLI tool суулгаж дууслаа.'.green);
					await startNestCLI(appName, shell.which('nest').stdout);
					resolve(true);
				});
			} else {
				await startNestCLI(appName, nestIsInstalled.stdout);
				resolve(true);
			}
		} else {
			console.log(`\n${MESSAGES.ERROR_NAME_EMPTY}!`.red);
			console.log(`\n${MESSAGES.INSTRUCTION_NAME_INPUT}: `);
			console.log('\ncreate-nest-app-dsd', 'app-name\n'.cyan);
			resolve(false);
		}
	});
};

const addTemplateFiles = (folder) => {
	shell.cp('-R', path.join(__dirname, Path.TEMPLATE, folder, '*'), `${appName}`);
};

const selectDbType = async () => {
	return inquirer.prompt([
		{
			type: 'list',
			name: 'db',
			message: MESSAGES.CHOOSE_DB,
			choices: [DbType.PostgreSQL, DbType.MySQL],
		},
	]);
};

const addEnvFiles = (folder) => {
	shell.cp(
		path.join(__dirname, Path.TEMPLATE, folder, Env.DEV),
		path.join(`${appName}`, Env.DEV)
	);
	shell.cp(
		path.join(__dirname, Path.TEMPLATE, folder, Env.PROD),
		path.join(`${appName}`, Env.PROD)
	);
};

const cdIntoApp = (appName) => {
	shell.cd(appName);
	insideProject = true;
};

const installPackages = async (dbType) => {
	const isUsingPnpm = shell.test('-f', LockFile.PNPM);
	const isUsingYarn = shell.test('-f', LockFile.YARN);

	const pacMan = isUsingPnpm ? PacMan.PNPM : isUsingYarn ? PacMan.YARN : PacMan.NPM;
	const installCmd = isUsingYarn ? 'add' : 'install';
	const devFlag = isUsingYarn ? '--dev' : '-D';
	const dbPackage = dbType === DbType.MySQL ? DbPackage.MySQL : DbPackage.PostgreSQL;

	const packageSpinner = spinner(MESSAGES.PACKAGE_INSTALLATION_IN_PROGRESS);
	packageSpinner.start();
	await new Promise((resolve) =>
		shell.exec(
			`${pacMan} ${installCmd} ${mainPackages} ${dbPackage}`,
			{ async: true, silent: true },
			() => resolve()
		)
	);
	packageSpinner.succeed();
	const devPackageSpinner = spinner(MESSAGES.DEV_PACKAGE_INSTALLATION_IN_PROGRESS);
	devPackageSpinner.start();
	await new Promise((resolve) =>
		shell.exec(
			`${pacMan} ${installCmd} ${devFlag} ${devPackages}`,
			{
				async: true,
				silent: true,
			},
			() => resolve()
		)
	);
	devPackageSpinner.succeed();
};

const editScripts = () => {
	try {
		const fileName = Path.PackageJSON;
		const jsonToEdit = JSON.parse(fs.readFileSync(fileName));
		for (const script of scriptNewValues) {
			const currentScript = jsonToEdit.scripts?.[script.key];
			const newScript =
				currentScript && !currentScript.includes('cross-env')
					? `${script.value} ${currentScript}`
					: currentScript;
			if (currentScript) jsonToEdit.scripts[script.key] = newScript;
		}
		fs.writeFileSync(fileName, JSON.stringify(jsonToEdit, null, 2));
	} catch (error) {
		console.log(`${MESSAGES.ERROR_SCRIPT}`.yellow);
	}
};

const cleanUp = () => {
	for (const fileOrDir of filesToRemove) {
		if (shell.test('-f', fileOrDir) || shell.test('-d', fileOrDir)) shell.rm('-rf', fileOrDir);
	}
};

const startNestCLI = async (appName, nestPath) => {
	try {
		//Generate new project using nest cli
		child_process.execFileSync(nestPath, ['new', `${appName}`], {
			stdio: 'inherit',
		});

		//Copy prepared boilerplate code to generated project
		addTemplateFiles(Path.MAIN);

		//Get selected DB type from prompt
		const selected = await selectDbType();

		//Replace some files if MySQL was selected
		if (selected.db === DbType.MySQL) addTemplateFiles(Path.MySQL);

		//Copy env files related to chosen db type
		addEnvFiles(selected.db === DbType.MySQL ? Path.MySQL : Path.MAIN);

		//CD into generated project
		cdIntoApp(appName);

		//Install new packages
		await installPackages(selected.db);

		//Edit scripts in package.json
		editScripts();

		//Clean up unnecessary files
		cleanUp();

		//Success
		console.log(`\n${appName} ${MESSAGES.PROJECT_SUCCESSFULLY_CREATED}`.cyan);
		console.log(`\n${MESSAGES.INSTRUCTION_POST_INSTALLATION}`.green);
	} catch (error) {
		if (insideProject) {
			shell.cd('..');
		}
		if (shell.test('-d', appName)) shell.rm('-rf', appName);
		console.log(`'${MESSAGES.ERROR}: ' ${error}`.red);
	}
};

const run = async () => {
	let success = await createNestApp();
	if (!success) {
		console.log(`${MESSAGES.ERROR}!`.red);
		return false;
	}
};

run();
