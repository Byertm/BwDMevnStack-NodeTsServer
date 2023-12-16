import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ICommentModel, { Comment } from '@/models/comment.model';
import { Post } from '@/models/post.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const comment = await Comment.find({}).populate({ path: 'author', match: { isActive: true }, select: 'first_name last_name name email' });
		res.status(httpStatus.OK).json(comment);
	} catch (e) {
		next(e);
	}
};

const getAllSubComments = async (commentId: string): Promise<ICommentModel[]> => {
	const subComments = await Comment.find({ parentId: commentId, isActive: true, isHidden: false, isBanned: false })
		.populate({ path: 'author', match: { isActive: true }, select: 'first_name last_name name email' })
		.populate({ path: 'postId', match: { isActive: true }, select: 'title slug author isActive' })
		.populate({ path: 'createUserId', select: 'first_name last_name name email' })
		.populate({ path: 'updateUserId', select: 'first_name last_name name email' })
		.exec();
	const results = await Promise.all(
		subComments.map(async (comment) => {
			const subs = await getAllSubComments(comment._id);
			return { ...comment.toObject(), children: subs || ([] as unknown) } as ICommentModel;
		})
	);
	return results;
};

const getCommentsByPostIdAndParentId = async (postId: string, parentId: string | null | undefined) => {
	const comments = await Comment.find({ postId: postId, parentId: parentId, isActive: true, isHidden: false, isBanned: false })
		.populate({ path: 'author', match: { isActive: true }, select: 'first_name last_name name email' })
		.populate({ path: 'postId', match: { isActive: true }, select: 'title slug author isActive' })
		.populate({ path: 'createUserId', select: 'first_name last_name name email' })
		.populate({ path: 'updateUserId', select: 'first_name last_name name email' })
		.exec();

	return comments;
};

const getCommentsByPostId = async (postId: string) => {
	try {
		let mainComments = await getCommentsByPostIdAndParentId(postId, null);

		// Ana commentlerin altındaki commentleri bul ve parent commentlerine ekle
		const newComments = [];
		for (let comment of mainComments) {
			const result = await getAllSubComments(comment._id);
			newComments.push({ ...comment.toObject(), children: result || [] });
		}
		return newComments;
	} catch (error) {
		console.error(error);
		// throw error;
		return [];
	}
};

const getAllByPostId = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comments = await getCommentsByPostId(req.params.postId);

		res.status(httpStatus.OK).json(comments);
	} catch (e) {
		next(e);
	}
};

const getAllByPostIdOld = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comments = await Comment.find({ postId: req.params.postId, isActive: true, isHidden: false, isBanned: false })
			.populate({ path: 'postId', select: 'title slug author isActive' })
			.populate({ path: 'createUserId', select: 'first_name last_name name email' })
			.populate({ path: 'updateUserId', select: 'first_name last_name name email' });
		res.status(httpStatus.OK).json(comments);
	} catch (e) {
		next(e);
	}
};

const getAuthorIdByReq = async (req: Request) => {
	let author = null;
	if (!!req.user) {
		const u: any = req.user;
		if (!!u?.id) author = u.id;
	}
	return author;
};

const authorMixin = async (req: Request) => {
	const author = await getAuthorIdByReq(req);
	return { ...req.body, author };
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comment = await Comment.findOne({ _id: req.params.id })
			.populate({ path: 'author', match: { isActive: true }, select: 'first_name last_name name email' })
			.populate({ path: 'parentId', select: 'title slug author isActive' })
			.populate({ path: 'createUserId', select: 'first_name last_name name email' })
			.populate({ path: 'updateUserId', select: 'first_name last_name name email' });
		if (!comment) throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
		res.status(httpStatus.OK).json(comment);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await authorMixin(req);
		const comment = new Comment(data);
		comment.createUserId = await getAuthorIdByReq(req);
		await comment.save();

		const post = await Post.findOne({ _id: req.body.postId });
		if (!post) throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');

		// Todo: Bu neden olmuyor bak!
		if (!post.comments?.length) post.comments = [];
		post.comments.push(comment.id);

		res.status(httpStatus.CREATED).json(comment);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comment = await Comment.findOne({ _id: req.params.id });
		if (!comment) throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
		const { comment: newComment, postId, parentId, isBanned, isHidden, isActive } = req.body;

		comment.comment = newComment;
		comment.postId = postId;
		comment.parentId = !!parentId ? parentId : null;
		comment.updateUserId = await getAuthorIdByReq(req);
		if (typeof isBanned === 'boolean') comment.isBanned = isBanned;
		if (typeof isHidden === 'boolean') comment.isHidden = isHidden;
		if (typeof isActive === 'boolean') comment.isActive = isActive;

		if (!comment.author) comment.author = await getAuthorIdByReq(req);

		// comment: string;
		// author: string;
		// postId: string;
		// createUserId: string | null | undefined;
		// updateUserId: string | null | undefined;
		// isBanned: boolean;
		// isHidden: boolean;
		// isActive: boolean;

		await comment.save();
		res.status(httpStatus.OK).json(comment);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comment = await Comment.findOne({ _id: req.params.id });
		if (!comment) throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
		const deleteQuery = comment.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getAllByPostId, getById, post, updateById, deleteById };

export default { get, getAllByPostId, getById, post, updateById, deleteById };