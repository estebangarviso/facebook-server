import { ObjectId } from 'mongoose';
import { Content } from './common';
export interface Comment extends Content {
	post: ObjectId;
	media?: ObjectId;
	content: string;
	replyTo?: ObjectId;
}
