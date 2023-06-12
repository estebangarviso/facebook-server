import { Ban, SoftDelete, Active, Information, Pictures } from '.';
import { UserGenderEnums, UserRoleEnums } from '@shared';

export interface UserUpdatableFields<Pass = string, Pics = string>
	extends Pictures<Pics> {
	firstName: string;
	lastName: string;
	email: string;
	password: Pass;
	phone?: string;
	dateOfBirth: Date;
	gender?: UserGenderEnums;
}
export type UserUpdatableFieldsWithoutPassword = Omit<
	UserUpdatableFields,
	'password'
>;
export interface UserRoles {
	roles: UserRoleEnums[];
}
export interface UserCreateIncoming
	extends UserUpdatableFields<string, Express.Multer.File> {}
export interface UserCreate extends UserUpdatableFields<CryptoHash> {}
export interface User
	extends UserUpdatableFields<CryptoHash>,
		Information,
		UserRoles,
		Ban,
		SoftDelete,
		Active {}
