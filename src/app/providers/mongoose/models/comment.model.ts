import { Schema, model } from 'mongoose';
import { ReactionSchema } from './../schemas';
import { Comment } from './interfaces';

const CommentSchema = new Schema<Comment>(
	{
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
		media: { type: Schema.Types.ObjectId, ref: 'Media' },
		content: {
			type: String,
			required: true,
			trim: true
		},
		replyTo: {
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		},
		reactions: [ReactionSchema]
	},
	{
		timestamps: true
	}
);
export interface CommentDocument extends Comment, Document {}
export const CommentModel = model<CommentDocument>('Comment', CommentSchema);
