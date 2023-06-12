import { UserBanDateMethods, UserTemporaryBanDurationEnums } from '@shared';

export function getUserBanDateMethodsByDurationHours(
	durationHours: UserTemporaryBanDurationEnums
): {
	setMethod: 'setHours' | 'setDate' | 'setMonth' | 'setFullYear';
	getMethod: 'getHours' | 'getDate' | 'getMonth' | 'getFullYear';
	value: number;
} {
	return UserBanDateMethods[durationHours];
}
