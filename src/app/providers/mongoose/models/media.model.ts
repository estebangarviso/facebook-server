import { Schema, model, Document } from 'mongoose';
import { MediaTypeEnums } from '@shared';
import { Media } from './interfaces';
export const MediaSchema = new Schema<Media>(
	{
		type: {
			type: String,
			enum: Object.values(MediaTypeEnums),
			required: true
		},
		name: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);
export interface MediaDocument extends Media, Document {}
export const MediaModel = model<Media>('Media', MediaSchema);
