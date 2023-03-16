import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Tag } from '@/models/tag.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';
import { slugify } from '@/models/mixin';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const tag = await Tag.find({});
		res.status(httpStatus.OK).json(tag);
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tag = await Tag.findOne({ _id: req.params.id, isActive: true });
		if (!tag) throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
		res.status(httpStatus.OK).json(tag);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tag = new Tag({ ...req.body });
		tag.slug = slugify(req.body.name);
		await tag.save();
		res.status(httpStatus.CREATED).json(tag);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tag = await Tag.findOne({ _id: req.params.id });
		if (!tag) throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
		const { name, slug, url, isActive } = req.body;

		tag.name = name;
		tag.slug = slugify(name);

		tag.url = url;
		if (typeof isActive === 'boolean') tag.isActive = isActive;

		// name: string;
		// slug: string;
		// url: string;
		// createUserId: string | null | undefined;
		// updateUserId: string | null | undefined;
		// isActive: boolean;

		await tag.save();
		res.status(httpStatus.OK).json(tag);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tag = await Tag.findOne({ _id: req.params.id });
		if (!tag) throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
		await tag.deleteOne();
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getById, post, updateById, deleteById };

export default { get, getById, post, updateById, deleteById };