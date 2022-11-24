import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudStorageService } from 'src/core/cloud-storage.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService, CloudStorageService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
