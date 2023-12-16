import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Role } from '@/models/role.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const role = await Role.find({});
		logger.debug('%o', role);
		res.status(httpStatus.OK).json(role);
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const role = await Role.findOne({ _id: req.params.id, isActive: true });
		if (!role) throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
		res.status(httpStatus.OK).json(role);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const role = new Role({ ...req.body });
		await role.save();
		res.status(httpStatus.CREATED).json(role);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const role = await Role.findOne({ _id: req.params.id });
		if (!role) throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
		const { name, isActive } = req.body;
		// logger.debug('%o', req.user);

		if (name) role.name = name;
		if (typeof isActive === 'boolean') role.isActive = isActive;

		// name: string;
		// isActive: boolean;

		await role.save();
		res.status(httpStatus.OK).json(role);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const role = await Role.findOne({ _id: req.params.id });
		if (!role) throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
		const deleteQuery = role.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getById, post, updateById, deleteById };

export default { get, getById, post, updateById, deleteById };