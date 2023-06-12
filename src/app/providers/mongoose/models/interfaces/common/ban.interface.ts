import {
	UserBanReasonEnums,
	UserBanTypeEnums,
	UserTemporaryBanDurationEnums
} from '@shared';
import { ObjectId } from 'mongoose';

export interface Ban {
	ban: {
		by?: ObjectId;
		status: boolean;
		at?: Date;
		reason?: UserBanReasonEnums;
		type?: UserBanTypeEnums;
		durationHours?: UserTemporaryBanDurationEnums;
	};
}
