import { Media, Content } from '.';
export interface PostUpdatableFields<M = Media> extends Content {
	medias?: M[];
}
export interface PostCreateIncoming
	extends PostUpdatableFields<Express.Multer.File> {}
export interface PostCreate extends PostUpdatableFields {}
export interface Post extends PostUpdatableFields {}
