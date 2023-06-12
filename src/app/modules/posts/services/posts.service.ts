import { Injectable } from '@core/decorators';
import { PostRepository } from '../repositories/post.repository';
import { CommentRepository } from '../repositories/comment.repository';
import {
	NotFoundException,
	ForbiddenException,
	BadRequestException
} from '@core/exceptions';
import { PostCreateIncoming } from '@providers/mongoose/models';
@Injectable()
export class PostsService {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly commentRepository: CommentRepository
	) {}

	public async getPosts(page: number, limit: number, sort?: string) {
		const posts = await this.postRepository.find({
			page,
			limit,
			sort
		});

		if (!posts) throw new NotFoundException();

		return posts;
	}

	public async getPostById(id: string) {
		const post = await this.postRepository.findById(id);

		if (!post) throw new NotFoundException();

		return post;
	}

	public async createPost(post: PostCreateIncoming) {
		const created = await this.postRepository.create(post);

		if (!created) throw new BadRequestException();

		return created;
	}

	public async updatePost(id: string, data: any) {
		return await this.postRepository.updatePost(id, data);
	}

	public async deletePost(id: string) {
		return await this.postRepository.deletePost(id);
	}

	public async getCommentsByPostId(postId: string) {
		return await this.commentRepository.getCommentsByPostId(postId);
	}

	public async createComment(data: any) {
		return await this.commentRepository.createComment(data);
	}

	public async updateComment(id: string, data: any) {
		return await this.commentRepository.updateComment(id, data);
	}

	public async deleteComment(id: string) {
		return await this.commentRepository.deleteComment(id);
	}
}
