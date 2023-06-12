import { Schema, model, Document } from 'mongoose';
import { ReactionSchema } from './../schemas';
import { env } from '@config';
import { Post } from './interfaces';
const PostSchema = new Schema<Post>(
	{
		author: { type: Schema.Types.ObjectId, ref: 'User' },
		medias: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Media'
				}
			],
			validate: [
				(v: Schema.Types.ObjectId[]) =>
					v.length <= env.API.POSTS.MAX_MEDIA_SIZE,
				'{PATH} is too long'
			]
		},
		content: {
			type: String,
			required: true,
			trim: true
		},
		reactions: [ReactionSchema]
	},
	{
		timestamps: true
	}
);

export interface PostDocument extends Post, Document {}
export const PostModel = model<PostDocument>('Post', PostSchema);
