import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudStorageService } from 'src/core/cloud-storage.service';
import { LogMsg } from 'src/shared/constants';
import { Helper } from 'src/shared/helper';
import { Raw, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
	@InjectRepository(User)
	private readonly repository: Repository<User>;
	@Inject(CloudStorageService)
	private readonly storageService: CloudStorageService;

	//Get own info
	public async getMe(decoded: any): Promise<User> {
		return decoded;
	}

	//Find user by username
	public findByUsername(username: string): Promise<User> {
		return this.repository.findOneBy({ username });
	}

	//Insert or update user
	public async upsertUser(user: User) {
		return this.repository.save(user);
	}

	//Check if user with same username or email exists
	public async findConflictUser(email: string, username: string): Promise<User> {
		return this.repository.findOne({
			where: [
				{
					email: Raw(
						(alias) =>
							`LOWER(${alias}) = LOWER(:email) OR LOWER(${alias}) = LOWER(:username)`,
						{ email, username }
					),
				},
				{
					username: Raw(
						(alias) =>
							`LOWER(${alias}) = LOWER(:username) OR LOWER(${alias}) = LOWER(:email)`,
						{ username, email }
					),
				},
			],
		});
	}

	//Email confirmation
	public async confirmUserEmail(user: User) {
		user.isEmailConfirmed = true;
		return this.repository.save(user);
	}

	//Update profile pic
	public async updateProfilePic(user: any, file: Express.Multer.File): Promise<string> {
		//Get user entity from authentication
		const userToUpdate = Helper.toUser(user);
		//Current profile pic
		const currentPic = userToUpdate.profilePic;
		//Subfolder name in cloud storage bucket
		const folder = 'profile';
		//Upload new picture to cloud
		const uploaded = await this.storageService.uploadFile(file, folder, true);
		//Remove old profile pic from cloud
		if (currentPic) {
			try {
				await this.storageService.removeFile(currentPic);
			} catch (error) {
				console.error(LogMsg.FAILED_FILE_REMOVE, error.response?.message);
			}
		}

		//Set new profile pic path
		userToUpdate.profilePic = uploaded.name;
		//Save to db
		await this.repository.save(userToUpdate);

		return uploaded.name;
	}
}
