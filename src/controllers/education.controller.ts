import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Education } from '@/models/education.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
	const education = await Education.find({});
	res.status(httpStatus.OK).json(education);
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const education = await Education.findOne({ _id: req.params.id, isActive: true });
		if (!education) throw new ApiError(httpStatus.NOT_FOUND, 'Education not found');
		res.status(httpStatus.OK).json(education);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const education = new Education({ ...req.body });
		await education.save();
		res.status(httpStatus.OK).json(education);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const education = await Education.findOne({ _id: req.params.id });
		if (!education) throw new ApiError(httpStatus.NOT_FOUND, 'Education not found');
		const { title, scholl, section, description, startDate, finishDate, isActive } = req.body;

		education.title = title;
		education.scholl = scholl;
		education.section = section;
		education.description = description;
		education.startDate = startDate;
		education.finishDate = finishDate;
		if (typeof isActive === 'boolean') education.isActive = isActive;

		// title: string;
		// scholl: string;
		// section: string;
		// description: string;
		// startDate: Date;
		// finishDate: Date | String;
		// isActive: boolean;

		await education.save();
		res.status(httpStatus.CREATED).json(education);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const education = await Education.findOne({ _id: req.params.id });
		if (!education) throw new ApiError(httpStatus.NOT_FOUND, 'Education not found');
		const deleteQuery = education.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getById, post, updateById, deleteById };

export default { get, getById, post, updateById, deleteById };