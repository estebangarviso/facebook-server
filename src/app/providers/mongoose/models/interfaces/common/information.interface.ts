import { VisibilityEnums } from '@shared';
import { Schema } from 'mongoose';
export interface Information {
	username: string;
	visibility: VisibilityEnums;
	followers: Schema.Types.ObjectId[];
}
