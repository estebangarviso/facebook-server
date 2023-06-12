import { Schema, model, Document } from 'mongoose';
import { VisibilityEnums } from '@shared';
import { Page } from './interfaces';

export const PageSchema = new Schema<Page>(
	{
		admin: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		profilePicture: {
			type: String
		},
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		username: {
			type: String,
			required: true,
			trim: true
		},
		category: {
			type: String,
			required: true,
			trim: true
		},
		bio: {
			type: String,
			trim: true
		},
		visibility: {
			type: String,
			default: VisibilityEnums.PUBLIC,
			enum: Object.values(VisibilityEnums)
		},
		followers: {
			type: [Schema.Types.ObjectId],
			ref: 'User'
		}
	},
	{
		timestamps: true
	}
);

export interface PageDocument extends Page, Document {}
export const PageModel = model<PageDocument>('Page', PageSchema);
