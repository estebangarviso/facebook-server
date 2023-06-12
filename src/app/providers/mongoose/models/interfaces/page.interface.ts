import { Schema } from 'mongoose';
import { Information, Pictures } from '.';

export interface Page extends Information, Pictures {
	admin: Schema.Types.ObjectId;
	name: string;
	category: string;
	bio?: string;
}
