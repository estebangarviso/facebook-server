import { Schema } from 'mongoose';
import { ReactionTypeEnums } from '@shared';
import { Reaction } from '../models/interfaces/common';
export const ReactionSchema = new Schema<Reaction>({
	type: {
		type: String,
		enum: Object.values(ReactionTypeEnums),
		required: true,
		unique: true
	},
	user: { type: Schema.Types.ObjectId, ref: 'User' }
});
