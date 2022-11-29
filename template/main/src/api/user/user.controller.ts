import {
	BadRequestException,
	Controller,
	Get,
	Inject,
	Put,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ErrorMsg } from 'src/shared/constants';
import { multerConfig } from 'src/shared/file/multer.config';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('User (To visit/edit own profile)')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
	@Inject(UserService)
	private readonly service: UserService;

	@ApiOperation({ summary: 'Get own user info' })
	@ApiBearerAuth('access_token')
	@Get()
	public getMe(@Req() req: Request): Promise<User> {
		return this.service.getMe(req.user);
	}

	@ApiOperation({ summary: 'Update profile pic' })
	@UseInterceptors(FileInterceptor('profile', multerConfig))
	@Put('profile-pic')
	public async updateProfilePicture(
		@Req() req: Request,
		@UploadedFile() file: Express.Multer.File
	): Promise<object> {
		if (!file) throw new BadRequestException(null, ErrorMsg.EMPTY_FILE);
		const fileName = await this.service.updateProfilePic(req.user, file[0]);
		return { profilePic: fileName };
	}
}
