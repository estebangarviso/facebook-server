import { Injectable } from '@core/decorators';
import {
	UserCreate,
	UserCreateIncoming,
	UserDocument,
	UserModel,
	UserUpdatableFieldsWithoutPassword
} from '@providers/mongoose/models';
import { hashPassword } from '@core/utils';
import { RedisProvider } from '@providers/redis';
import { SimpleCloudStorageProvider } from '@providers/aws';

const USER_REDIS_PREFIX = 'user:';

@Injectable()
export class UserRepository {
	constructor(
		private readonly cache: RedisProvider,
		private readonly s3: SimpleCloudStorageProvider
	) {}

	async create(user: UserCreateIncoming): Promise<UserDocument> {
		const { salt, hash } = hashPassword(user.password);
		const profilePicture = user.profilePicture;
		user.profilePicture && delete user.profilePicture;
		const userWithoutProfilePicture: Omit<
			UserCreate,
			'profilePicture' | 'password'
		> = user;
		const userDoc: UserCreate = {
			...userWithoutProfilePicture,
			password: {
				salt,
				hash
			}
		};

		if (profilePicture) {
			this.s3.upload(profilePicture, {
				width: 800,
				height: 800
			});

			userDoc.profilePicture = this.s3.getKeyFromFile(profilePicture);
		}

		const createUser = new this.userModel(userDoc);

		const createdUser = await createUser.save();

		this.setCache(createdUser);

		return createdUser;
	}

	async findById(id: string): Promise<UserDocument | null> {
		const cachedUser = await this.getCacheUserById(id);

		if (cachedUser) return cachedUser;

		return await this.userModel.findById(id).exec();
	}

	async findByEmail(email: string): Promise<UserDocument | null> {
		const cachedUser = await this.getCacheUserByEmail(email);
		if (cachedUser) return cachedUser;

		return await this.userModel.findOne({ email }).exec();
	}

	async updateById(
		id: string,
		updates: UserUpdatableFieldsWithoutPassword
	): Promise<UserDocument | undefined> {
		const updatedUser = await this.userModel
			.findByIdAndUpdate(id, updates, {
				new: true
			})
			.exec();
		if (!updatedUser) return;
		this.setCache(updatedUser);

		return updatedUser;
	}

	async updatePassword(
		id: string,
		password: string
	): Promise<UserDocument | undefined> {
		const { salt, hash } = hashPassword(password);

		const updatedUser = await this.userModel
			.findByIdAndUpdate(
				id,
				{
					password: {
						salt,
						hash
					}
				},
				{ new: true }
			)
			.exec();

		if (!updatedUser) return;

		this.setCache(updatedUser);

		return updatedUser;
	}

	async deleteById(
		id: string,
		softDelete = true
	): Promise<UserDocument | undefined> {
		let deletedUser;
		if (softDelete) {
			deletedUser = await this.userModel
				.findByIdAndUpdate(id, {
					deletedAt: new Date()
				})
				.exec();

			if (!deletedUser) return;

			this.setCache(deletedUser);

			return deletedUser;
		}

		if (!deletedUser) {
			deletedUser = await this.userModel.findByIdAndDelete(id).exec();

			if (!deletedUser) return;

			this.delCache(deletedUser);
		}

		return deletedUser;
	}

	validatePassword(userPassword: CryptoHash, password: string): boolean {
		const { hash } = hashPassword(password, false);

		return userPassword.hash === hash;
	}

	private setCache(user: UserDocument) {
		this.cache.set(`${USER_REDIS_PREFIX}${user.id}`, user);
		this.cache.set(`${USER_REDIS_PREFIX}${user.email}`, user.id);
	}

	private delCache(user: UserDocument) {
		this.cache.del(`${USER_REDIS_PREFIX}${user.id}`);
		this.cache.del(`${USER_REDIS_PREFIX}${user.email}`);
	}

	private async getCacheUserById(id: string): Promise<UserDocument | null> {
		const cachedUser = await this.cache.get<UserDocument>(
			`${USER_REDIS_PREFIX}${id}`
		);

		if (cachedUser) return cachedUser;

		return null;
	}

	private async getCacheUserByEmail(
		email: string
	): Promise<UserDocument | null> {
		const cachedUserId = await this.cache.get<string>(
			`${USER_REDIS_PREFIX}${email}`
		);

		if (cachedUserId) return await this.getCacheUserById(cachedUserId);

		return null;
	}

	private readonly userModel = UserModel;
}
