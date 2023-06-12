import { InternalServerError, Unauthorized, NotFound } from 'http-errors';
import rateLimit from 'express-rate-limit';
import { AccessControlMiddleware } from '@shared';
import { PostModel, CommentModel } from '@providers/mongoose/models';
import { env } from '@config';
import { Request, Response } from 'express';
import { Controller, Get, Post, Delete, Use } from '@core/decorators';
import { PostsService } from './../services/posts.service';

@Use(AccessControlMiddleware)
@Controller('/posts')
export class PostsController {
	constructor(private readonly _service: PostsService) {}

	@Use(
		rateLimit({
			windowMs: 60 * 60 * 1000 * 24, // 24 hour window
			max: 25, // limit each IP to 25 requests per windowMs
			message:
				'Too many requests from this IP, please try again after 24 hours',
			skipFailedRequests: true
		})
	)
	@Post()
	public async createPost(
		req: Request & { user?: PublicUser; files?: any },
		res: Response
	) {
		const currentUser = req.user as PublicUser;
		const body = req.body;
		const files = req.files;
		const medias = files?.medias;
		try {
			// Check if multiple files are uploaded
			const mediaFiles = (
				medias ? (Array.isArray(medias) ? medias : [medias]) : []
			).map((file) => ({
				type: file.mimetype ?? 'image/jpeg',
				path: file.filepath
			}));
			body.medias = mediaFiles;

			const post = new PostModel(body);
			const savedPost = await post.save();
			// save images
			Form(req, {
				subFolder: 'posts'
			});
			await savedPost.populate('user', PostUserPopulate);

			const webSocketServer: WebSocketServer =
				req.app.get('webSocketServer');
			webSocketServer.sendMessage({
				type: 'posts/postAdded',
				payload: savedPost
			});

			return res.status(200).json({
				success: true,
				message: `Post created by user with email ${currentUser.email}`
			});
		} catch {
			throw new InternalServerError(
				`Error creating post by user with email ${currentUser.email}`
			);
		}
	}

	@Get('/:postId')
	public async readPost(req: Request, res: Response) {}

	@Get()
	public async readPosts(req: Request, res: Response) {
		const pageNumber = Number(req.query.pageNumber) || 0;
		const pageSize = Number(req.query.pageSize) || env.API.POSTS.PAGE_SIZE;
		const posts = await PostModel.find({})
			.sort({
				createAt: -1,
				updatedAt: -1,
				__v: -1
			})
			.skip(pageNumber * pageSize)
			.limit(pageSize)
			.populate('user', PostUserPopulate);

		return res.status(200).json({
			posts,
			pageNumber,
			pageSize,
			hasMore: posts.length === pageSize
		});
	}

	@Delete('/:postId')
	public async deletePost(
		req: Request & { user?: PublicUser },
		res: Response
	) {
		const postId = req.params.postId;
		const currentUser = req.user as PublicUser;
		try {
			const post = await PostModel.findById(postId);
			if (!post) throw new NotFound('Post not found');

			if (post.author !== currentUser._id) {
				throw new Unauthorized(
					'You are not authorized to delete this post'
				);
			}
			PostModel.deleteOne({ _id: postId });

			const webSocketServer: WebSocketServer =
				req.app.get('webSocketServer');
			webSocketServer.sendMessage({
				type: 'posts/postDeleted',
				payload: postId
			});

			return res.status(200).json({
				success: true,
				message: `Post with id ${postId} deleted`
			});
		} catch {
			throw new InternalServerError(
				`Error deleting post with id ${postId}`
			);
		}
	}

	@Post('/:postId/comments')
	public async createComment(
		req: Request & { user?: PublicUser },
		res: Response
	) {
		const currentUser = req.user as PublicUser;
		const body = req.body;
		const postId = req.params.postId;

		try {
			const comment = new CommentModel({
				content: body.content,
				user: currentUser._id,
				post: postId,
				replyTo: body.replyTo
			});
			await comment.save();

			const webSocketServer: WebSocketServer =
				req.app.get('webSocketServer');
			webSocketServer.sendMessage({
				type: 'comments/commentAdded',
				payload: comment
			});

			return res.status(200).json({
				success: true,
				message: `Comment created by user with email ${currentUser.email}`
			});
		} catch {
			throw new InternalServerError(
				`Error creating comment by user with email ${currentUser.email}`
			);
		}
	}

	@Get('/:postId/comments')
	public async readComments(req: Request, res: Response) {
		const comments = await CommentModel.find({
			post: req.params.postId
		})
			.populate('user', PostUserPopulate)
			.populate('replyTo');

		return res.status(200).json({ success: true, comments });
	}

	@Delete('/:postId/comments/:commentId')
	public async deleteComment(
		req: Request & { user?: PublicUser },
		res: Response
	) {
		const commentId = req.params.commentId;
		const currentUser = req.user as PublicUser;
		try {
			const comment = await CommentModel.findById(commentId);
			if (!comment) throw new NotFound('Comment not found');

			if (comment.author !== currentUser._id) {
				throw new Unauthorized(
					'You are not authorized to delete this comment'
				);
			}
			CommentModel.deleteOne({ _id: commentId });

			const webSocketServer: WebSocketServer =
				req.app.get('webSocketServer');
			webSocketServer.sendMessage({
				type: 'comments/commentDeleted',
				payload: commentId
			});

			return res.status(200).json({
				success: true,
				message: `Comment with id ${commentId} deleted`
			});
		} catch {
			throw new InternalServerError(
				`Error deleting comment with id ${commentId}`
			);
		}
	}
}
