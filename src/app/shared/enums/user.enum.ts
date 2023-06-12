export enum UserRoleEnums {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	MODERATOR = 'MODERATOR',
	USER = 'PERSON',
	ANONYMOUS = 'ANONYMOUS'
}
export enum UserBanReasonEnums {
	SPAM = 'SPAM',
	INAPPROPRIATE = 'INAPPROPRIATE',
	FRAUD = 'FRAUD',
	FAKE_ACCOUNT = 'FAKE_ACCOUNT',
	OBJECTIONABLE_CONTENT = 'OBJECTIONABLE_CONTENT',
	HARASSMENT = 'HARASSMENT',
	SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
	ILLEGAL_ACTIVITY = 'ILLEGAL_ACTIVITY',
	OTHER = 'OTHER'
}
export enum UserBanTypeEnums {
	PERMANENT = 'PERMANENT',
	TEMPORARY = 'TEMPORARY'
}
export enum UserTemporaryBanDurationEnums {
	ONE_HOUR = 1,
	THREE_HOURS = 3,
	ONE_DAY = 24,
	THREE_DAYS = 24 * 3,
	ONE_WEEK = 24 * 7,
	ONE_MONTH = 24 * 30,
	THREE_MONTHS = 24 * 30 * 3,
	SIX_MONTHS = 24 * 30 * 6,
	ONE_YEAR = 24 * 30 * 12,
	FOREVER = 24 * 30 * 12 * 100
}

export enum UserGenderEnums {
	FEMALE = 'female',
	MALE = 'male',
	OTHER = 'other',
	NOT_SPECIFIED = 'not_specified'
}

export const UserBanDateMethods: Record<
	UserTemporaryBanDurationEnums,
	{
		setMethod: 'setHours' | 'setDate' | 'setMonth' | 'setFullYear';
		getMethod: 'getHours' | 'getDate' | 'getMonth' | 'getFullYear';
		value: number;
	}
> = {
	[UserTemporaryBanDurationEnums.ONE_HOUR]: {
		setMethod: 'setHours',
		getMethod: 'getHours',
		value: 1
	},
	[UserTemporaryBanDurationEnums.THREE_HOURS]: {
		setMethod: 'setHours',
		getMethod: 'getHours',
		value: 3
	},
	[UserTemporaryBanDurationEnums.ONE_DAY]: {
		setMethod: 'setDate',
		getMethod: 'getDate',
		value: 1
	},
	[UserTemporaryBanDurationEnums.THREE_DAYS]: {
		setMethod: 'setDate',
		getMethod: 'getDate',
		value: 3
	},
	[UserTemporaryBanDurationEnums.ONE_WEEK]: {
		setMethod: 'setDate',
		getMethod: 'getDate',
		value: 7
	},
	[UserTemporaryBanDurationEnums.ONE_MONTH]: {
		setMethod: 'setMonth',
		getMethod: 'getMonth',
		value: 1
	},
	[UserTemporaryBanDurationEnums.THREE_MONTHS]: {
		setMethod: 'setMonth',
		getMethod: 'getMonth',
		value: 3
	},
	[UserTemporaryBanDurationEnums.SIX_MONTHS]: {
		setMethod: 'setMonth',
		getMethod: 'getMonth',
		value: 6
	},
	[UserTemporaryBanDurationEnums.ONE_YEAR]: {
		setMethod: 'setFullYear',
		getMethod: 'getFullYear',
		value: 1
	},
	[UserTemporaryBanDurationEnums.FOREVER]: {
		setMethod: 'setFullYear',
		getMethod: 'getFullYear',
		value: 100
	}
};
