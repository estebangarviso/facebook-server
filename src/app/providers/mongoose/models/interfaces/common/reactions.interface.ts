import { ReactionTypeEnums } from '@shared';
import { Schema } from 'mongoose';
export interface Reaction {
	type: ReactionTypeEnums;
	user: Schema.Types.ObjectId;
}
