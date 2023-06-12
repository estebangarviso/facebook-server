import {
	CommentModel,
	Comment,
	CommentDocument
} from '@providers/mongoose/models';
import { Injectable } from '@core/decorators';
@Injectable()
export class CommentRepository {
	async create(comment: Comment): Promise<CommentDocument> {
		const createComment = new this._commentModel(comment);

		return await createComment.save();
	}

	async findById(id: string): Promise<CommentDocument | null> {
		return await this._commentModel.findById(id);
	}

	async updateById(
		id: string,
		comment: Partial<Comment>
	): Promise<CommentDocument | null> {
		return await this._commentModel.findOneAndUpdate(
			{ _id: id },
			{ $set: comment },
			{ new: true }
		);
	}

	async deleteById(id: string): Promise<CommentDocument | null> {
		return await this._commentModel.findOneAndDelete({ _id: id });
	}

	async findAll(): Promise<CommentDocument[]> {
		return await this._commentModel.find();
	}

	async findByPostId(postId: string): Promise<CommentDocument[]> {
		return await this._commentModel.find({ postId });
	}

	async findByUserId(userId: string): Promise<CommentDocument[]> {
		return await this._commentModel.find({ userId });
	}

	async findByReplyToId(replyToId: string): Promise<CommentDocument[]> {
		return await this._commentModel.find({ replyToId });
	}

	private readonly _commentModel = CommentModel;
}
