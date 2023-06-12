import { Schema } from 'mongoose';
import { Reaction } from './reactions.interface';

export interface Content {
	author: Schema.Types.ObjectId;
	content: string;
	reactions?: Reaction[];
}
