import { Injectable } from '@core/decorators';
import { UserRepository } from './../repositories/user.repository';
import { HttpErrorMessages } from '@shared';
import { NotFoundException } from '@core/exceptions';
import {
	UserCreateIncoming,
	UserUpdatableFieldsWithoutPassword
} from '@providers/mongoose/models';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async create(user: UserCreateIncoming) {
		return await this.userRepository.create(user);
	}

	async findById(id: string) {
		const user = await this.userRepository.findById(id);

		if (!user)
			throw new NotFoundException(HttpErrorMessages.USER_NOT_FOUND);

		return user;
	}

	async findByEmail(email: string) {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new NotFoundException(
				HttpErrorMessages.EMAIL_IS_NOT_REGISTERED
			);
		}

		return user;
	}

	async updateById(id: string, updates: UserUpdatableFieldsWithoutPassword) {
		const user = await this.userRepository.updateById(id, updates);

		if (!user)
			throw new NotFoundException(HttpErrorMessages.USER_NOT_FOUND);

		return user;
	}

	async updatePassword(id: string, password: string) {
		const user = await this.userRepository.updatePassword(id, password);

		if (!user)
			throw new NotFoundException(HttpErrorMessages.USER_NOT_FOUND);

		return user;
	}

	async deleteById(id: string) {
		const user = await this.userRepository.deleteById(id);

		if (!user)
			throw new NotFoundException(HttpErrorMessages.USER_NOT_FOUND);

		return user;
	}

	async checkId(id: string) {
		const user = await this.userRepository.findById(id);

		return !!user;
	}

	async checkEmail(email: string) {
		const user = !!(await this.userRepository.findByEmail(email));

		return !!user;
	}

	validatePassword(userPassword: CryptoHash, password: string) {
		return this.userRepository.validatePassword(userPassword, password);
	}
}
