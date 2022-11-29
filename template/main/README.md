<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Тайлбар

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. (Customized for DSD)

## Ажиллуулахаас өмнө

1. **".dev.env"** файлыг нээж шаардлагатай утгуудыг тохируулах
2. **PostgreSQL**-тэй холбогдох тохиргоотой байгаа тул өөр төрлийн DB холбохдоо [TypeORM](https://www.npmjs.com/package/typeorm)-ийн зааврын дагуу **_src/core/typeorm.service.ts_** файлыг өөрчилнө.
3. Google cloud storage-тэй харьцаж ажиллах бол **_src/shared/cloud/google-storage.config.ts_** дотор шаардлагатай тохиргоог хийнэ. **_src/core/cloud-storage.service.ts_** дотор bucket-ийн нэрийг тохируулна.
4. 3rd party API-руу axios ашиглаж хүсэлт илгээх шаардлагатай бол жишээ код **_src/api/reference_** дотор байгаа. Шаардлагагүй бол уг фолдер болон axios package-ыг устгана.
5. Бүртгүүлэх үед ашиглах basic authentication болон нэвтэрсэн үед ашиглах jwt authentication-тэй кодууд **_src/auth_** дотор байгаа ба **_src/api/user_** module-тай хослож ажиллана.
6. **_src/core_**: Google cloud storage-тай ажиллах, cache тохируулах, global exception handle хийх, имейл болон баазын тохиргоонууд
7. **_src/mail_**: Имейлийн загвар болон бусад тохиргоо
8. **.gitignore** файлд .env файлуудыг нэмнэ

## App ажиллуулах

```bash
# development
$ npm run start
$ yarn run start
$ pnpm run start

# development with watch mode
$ npm run start:dev
$ yarn run start:dev
$ pnpm run start:dev

# production mode
$ npm run start:prod
$ yarn run start:prod
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
$ yarn run test
$ pnpm run test

# e2e tests
$ npm run test:e2e
$ yarn run test:e2e
$ pnpm run test:e2e

# test coverage
$ npm run test:cov
$ yarn run test:cov
$ pnpm run test:cov
```

## API Documentation (Swagger)

Swagger documentation is accessible at **_/doc_** page. (Example: http://localhost:3000/doc)

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
