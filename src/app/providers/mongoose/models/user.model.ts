import { Document, Schema, model } from 'mongoose';
import {
	UserBanReasonEnums,
	UserBanTypeEnums,
	UserTemporaryBanDurationEnums,
	UserGenderEnums,
	UserRoleEnums,
	getUserBanDateMethodsByDurationHours
} from '@shared';
import { md5 } from '@core/utils';
import { User } from './interfaces';
import { env } from '@config';

export const UserSchema = new Schema<User>(
	{
		profilePicture: {
			type: String
		},
		firstName: {
			type: String,
			required: true,
			trim: true
		},
		lastName: {
			type: String,
			required: true,
			trim: true
		},
		username: {
			type: String,
			trim: true,
			unique: true,
			index: true,
			default(this: User) {
				return md5(this.email);
			}
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true
		},
		password: {
			hash: {
				type: String,
				required: true
			},
			salt: {
				type: String,
				required: true
			}
		},
		phone: {
			type: String,
			trim: true,
			maxlength: 16,
			unique: true
		},
		gender: {
			type: String,
			enum: Object.values(UserGenderEnums),
			required: true,
			default: UserGenderEnums.NOT_SPECIFIED
		},
		roles: {
			type: [String],
			enum: Object.values(UserRoleEnums),
			default: [UserRoleEnums.USER]
		},
		dateOfBirth: {
			type: Date,
			required: true
		},
		active: {
			type: Boolean,
			default: false
		},
		deletedAt: {
			type: Date
		},
		deleted: {
			type: Boolean,
			default: false
		},
		ban: {
			by: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			at: {
				type: Date
			},
			reason: {
				type: String,
				enum: Object.values(UserBanReasonEnums)
			},
			type: {
				type: String,
				enum: Object.values(UserBanTypeEnums)
			},
			durationHours: {
				type: Number,
				enum: Object.values(UserTemporaryBanDurationEnums)
			}
		}
	},
	{
		timestamps: true
	}
);

// Pre hooks
UserSchema.pre<UserDocument>('save', function (next) {
	// if user is soft deleted, set deletedAt
	if (this.deleted) this.deletedAt = new Date();

	next();
});

// Virtuals
UserSchema.virtual('banned').get(function (this: User) {
	const {
		ban: { at, type, durationHours }
	} = this;

	if (!at) return false;

	if (type === UserBanTypeEnums.PERMANENT) return true;

	if (type === UserBanTypeEnums.TEMPORARY && durationHours) {
		const now = new Date();
		const banEnd = new Date(at);
		const { setMethod, getMethod, value } =
			getUserBanDateMethodsByDurationHours(durationHours);

		banEnd[setMethod](banEnd[getMethod]() + value);

		return now < banEnd;
	}

	return false;
});
export interface UserDocument extends User, Document {}
export const UserModel = model<UserDocument>('User', UserSchema);
