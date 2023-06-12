import {
	PostModel,
	PostUpdatableFields,
	PostDocument,
	PostCreateIncoming,
	PostCreate
} from '@providers/mongoose/models';
import { Injectable } from '@core/decorators';
import { PaginationSearchOptions } from '@shared';
import { SimpleCloudStorageProvider } from '@providers/aws';
import { isArray } from '@core/utils';
@Injectable()
export class PostRepository {
	constructor(private readonly s3: SimpleCloudStorageProvider) {}

	async create(post: PostCreateIncoming): Promise<PostDocument> {
		const medias = post.medias;
		if (isArray(medias) && medias.length > 0) delete post.medias;
		const postWithoutMedias: Omit<PostCreateIncoming, 'medias'> = post;

		const postDoc: PostCreate = postWithoutMedias;

		const create = new this._postModel(postDoc);

		// TODO: upload to s3
		return await create.save();
	}

	find({
		page,
		limit,
		sort = { createdAt: -1 }
	}: PaginationSearchOptions): Promise<PostDocument[]> {
		return this._postModel
			.find()
			.sort(sort)
			.skip(page * limit)
			.limit(limit)
			.populate<PostDocument>(this._populateOptions)
			.exec();
	}

	findById(
		id: string,
		options?: { populate: boolean }
	): Promise<PostDocument | null> {
		if (options?.populate) {
			return this._postModel
				.findById(id)
				.populate<PostDocument>(this._populateOptions)
				.exec();
		}

		return this._postModel.findById(id).exec();
	}

	updateById(
		id: string,
		updates: PostUpdatableFields
	): Promise<PostDocument | null> {
		return this._postModel.findByIdAndUpdate(id, updates, {
			new: true
		});
	}

	deleteById(id: string): Promise<PostDocument | null> {
		return this._postModel.findOneAndDelete({ _id: id });
	}

	findByUserId(userId: string): Promise<PostDocument[]> {
		return this._postModel.find({ author: userId });
	}

	private readonly _postModel = PostModel;

	private readonly _populateOptions = {
		path: 'user',
		select: 'profilePicture firstName lastName'
	};
}
