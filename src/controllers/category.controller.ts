import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Category } from '@/models/category.model';
import { paginationHelper, PaginationResult, slugify } from '@/models/mixin';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const category = await Category.find({});
		res.status(httpStatus.OK).json(category);
	} catch (e) {
		next(e);
	}
};

const getAllWithPagination = async (req: Request, res: Response) => {
	try {
		const { skip, limit, pageNumber, hasPrev, hasNext, totalCount, totalPages }: PaginationResult = await paginationHelper(req, res, Category);

		const categories = await Category.find({}, {}, { limit, skip }).populate({ path: 'parentId', match: { isActive: true }, select: 'name url slug parentId isActive' });

		const customResponse = {
			pageNumber,
			size: limit,
			data: categories,
			dataCount: categories?.length || 0,
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
		const category = await Category.findOne({ _id: req.params.id });
		if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
		res.status(httpStatus.OK).json(category);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const slug = slugify(req.body.name);
		const category = new Category({ ...req.body, slug });

		await category.save();
		res.status(httpStatus.CREATED).json(category);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const category = await Category.findOne({ _id: req.params.id });
		if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
		const { name, url, parentId, isActive } = req.body;

		category.name = name;
		category.slug = slugify(name);
		if (!!url) category.url = url;
		category.parentId = !!parentId ? parentId : null;
		if (typeof isActive === 'boolean') category.isActive = isActive;

		await category.save();
		res.status(httpStatus.OK).json(category);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const category = await Category.findOne({ _id: req.params.id });
		if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
		const deleteQuery = category.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getAllWithPagination, getById, post, updateById, deleteById };

export default { get, getAllWithPagination, getById, post, updateById, deleteById };