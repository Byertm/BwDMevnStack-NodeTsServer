import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Category } from '@/models/category.model';
import { Post } from '@/models/post.model';
import { paginationHelper, PaginationResult, slugify } from '@/models/mixin';
import { Tag } from '@/models/tag.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const posts = await Post.find({})
			.populate({ path: 'author', match: { isActive: true }, select: 'first_name last_name name email' })
			.populate({ path: 'category', match: { isActive: true }, select: 'name url parentId' })
			.populate({ path: 'comments', match: { isBanned: false, isActive: true }, select: 'comment postId parentId isBanned isHidden' })
			.populate({ path: 'tags', match: { isActive: true }, select: 'name slug url' })
			.populate({ path: 'createUserId', select: 'first_name last_name name email' })
			.populate({ path: 'updateUserId', select: 'first_name last_name name email' });
		res.status(httpStatus.OK).json(posts);
	} catch (e) {
		next(e);
	}
};

const getAllWithPagination = async (req: Request, res: Response) => {
	// Todo: Bu kısım ayrı bir util function yapılıp diğer yerlerde kullanılsın.
	// Todo: Tüm liste-tablo yapıları için standart bir response dönülsün. Belki de tüm endpoinler için.
	// #region Pagination
	// const query = { skip: 0, limit: 5, pageNumber: 1, hasPrev: false, hasNext: true };
	// const qPageNumber = parseInt(req.query.pageNumber as string | undefined, 10) || query.skip + 1;
	// const qSize = parseInt(req.query.size as string | undefined, 10) || query.limit;

	// if (qPageNumber <= 0) {
	// 	const response = { error: true, message: 'invalid page number, should start with 1' };
	// 	return res.json(response);
	// }

	// const totalCount = await Post.count({});
	// const totalPages = Math.ceil(totalCount / qSize);

	// query.pageNumber = qPageNumber;
	// query.skip = qSize * (qPageNumber - 1);

	// query.hasNext = qPageNumber < totalPages;
	// query.hasPrev = totalPages > 1 && qPageNumber > 1;

	// if (totalCount <= query.skip) {
	// 	query.skip = 0;
	// 	query.pageNumber = 1;

	// 	if (qPageNumber === totalPages) {
	// 		query.hasPrev = false;
	// 		query.hasNext = false;
	// 	}
	// }

	// query.limit = qSize;

	// const { skip, limit, pageNumber, hasPrev, hasNext } = query;
	// #endregion

	// let skip: number, limit: number, pageNumber: number, hasPrev: boolean, hasNext: boolean;

	try {
		const { skip, limit, pageNumber, hasPrev, hasNext, totalCount, totalPages }: PaginationResult = await paginationHelper(req, res, Post);

		const posts = await Post.find({}, {}, { limit, skip })
			.populate({ path: 'author', match: { isActive: true }, select: 'first_name last_name name email' })
			.populate({ path: 'category', match: { isActive: true }, select: 'name url parentId' })
			.populate({ path: 'comments', match: { isBanned: false, isActive: true }, select: 'comment postId parentId isBanned isHidden' })
			.populate({ path: 'tags', match: { isActive: true }, select: 'name slug url' })
			.populate({ path: 'createUserId', select: 'first_name last_name name email' })
			.populate({ path: 'updateUserId', select: 'first_name last_name name email' });

		const customResponse = {
			pageNumber,
			size: limit,
			data: posts,
			dataCount: posts?.length || 0,
			totalCount,
			totalPages,
			hasPrev,
			hasNext
		};

		res.status(httpStatus.OK).json(customResponse);
	} catch (error) {}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const post = await Post.findOne({ _id: req.params.id, isActive: true });
		if (!post) throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
		else res.status(httpStatus.OK).json(post);
	} catch (e) {
		next(e);
	}
};

const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const post = await Post.findOne({ slug: req.params.slug });
		// if (!post) res.status(httpStatus.NOT_FOUND).send(new ApiError(httpStatus.NOT_FOUND, 'Post not found'));
		// else res.status(httpStatus.OK).json(post);
		if (!post) throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
		res.status(httpStatus.OK).json(post);
	} catch (e) {
		next(e);
	}
};

const getAllByCategory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const category = await Category.findOne({ slug: req.params.slug });
		if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');

		const posts = await Post.find({ categoryId: category.id })
			.populate({ path: 'author', match: { isActive: true }, select: 'first_name last_name name email' })
			.populate({ path: 'category', match: { isActive: true }, select: 'name url parentId' })
			.populate({ path: 'comments', match: { isBanned: false, isActive: true }, select: 'comment postId parentId isBanned isHidden' })
			.populate({ path: 'tags', match: { isActive: true }, select: 'name slug url' })
			.populate({ path: 'createUserId', select: 'first_name last_name name email' })
			.populate({ path: 'updateUserId', select: 'first_name last_name name email' });
		res.status(httpStatus.OK).json(posts);
	} catch (e) {
		next(e);
	}
};

const getAllByTag = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tag = await Tag.findOne({ slug: req.params.slug });
		if (!tag) throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');

		const posts = await Post.find({ tags: tag.id })
			.populate({ path: 'author', match: { isActive: true }, select: 'first_name last_name name email' })
			.populate({ path: 'category', match: { isActive: true }, select: 'name url parentId' })
			.populate({ path: 'comments', match: { isBanned: false, isActive: true }, select: 'comment postId parentId isBanned isHidden' })
			.populate({ path: 'tags', match: { isActive: true }, select: 'name slug url' })
			.populate({ path: 'createUserId', select: 'first_name last_name name email' })
			.populate({ path: 'updateUserId', select: 'first_name last_name name email' });
		res.status(httpStatus.OK).json(posts);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const post = new Post({ ...req.body });
		post.slug = slugify(req.body.title);
		await post.save();
		res.status(httpStatus.CREATED).json(post);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const post = await Post.findOne({ _id: req.params.id });
		if (!post) throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
		const { title, preTitle, content, imageUrl, author, category, tags, isActive } = req.body;

		post.title = title;
		post.slug = slugify(title);
		post.preTitle = preTitle;
		post.content = content;
		post.imageUrl = imageUrl;
		post.author = author;
		post.category = category;
		post.tags = tags;
		// post.comments = comments;
		if (typeof isActive === 'boolean') post.isActive = isActive;

		// title: string;
		// slug: string;
		// preTitle: string;
		// content: string;
		// imageUrl: string;
		// createUserId: string | null | undefined;
		// updateUserId: string | null | undefined;
		// author: Schema.Types.ObjectId | null | undefined;
		// category: Schema.Types.ObjectId | null | undefined;
		// tags: Array<number>;
		// isActive: boolean;

		await post.save();
		res.status(httpStatus.OK).json(post);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const post = await Post.findOne({ _id: req.params.id });
		if (!post) throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
		await post.deleteOne();
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getAllWithPagination, getAllByCategory, getAllByTag, getById, getBySlug, post, updateById, deleteById };

export default { get, getAllWithPagination, getAllByCategory, getAllByTag, getById, getBySlug, post, updateById, deleteById };