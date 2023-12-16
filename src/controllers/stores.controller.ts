import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Store } from '@/models/store.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const store = await Store.find({});
		res.status(httpStatus.OK).json(store);
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const store = await Store.findOne({ _id: req.params.id, isActive: true });
		if (!store) throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
		res.status(httpStatus.OK).json(store);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const store = new Store({ ...req.body });
		await store.save();
		res.status(httpStatus.CREATED).json(store);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const store = await Store.findOne({ _id: req.params.id });
		if (!store) throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
		const { name, description, image } = req.body;
		if (name) {
			store.name = name;
		}
		if (description) {
			store.description = description;
		}
		if (image) {
			store.image = image;
		}
		await store.save();
		res.status(httpStatus.OK).json(store);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const store = await Store.findOne({ _id: req.params.id });
		if (!store) throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
		const deleteQuery = store.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getById, post, updateById, deleteById };

export default { get, getById, post, updateById, deleteById };