import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Experience } from '@/models/experience.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
	const experience = await Experience.find({});
	res.status(httpStatus.OK).json(experience);
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const experience = await Experience.findOne({ _id: req.params.id, isActive: true });
		if (!experience) throw new ApiError(httpStatus.NOT_FOUND, 'Experience not found');
		res.status(httpStatus.OK).json(experience);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const experience = new Experience({ ...req.body });
		await experience.save();
		res.status(httpStatus.OK).json(experience);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const experience = await Experience.findOne({ _id: req.params.id });
		if (!experience) throw new ApiError(httpStatus.NOT_FOUND, 'Experience not found');
		const { title, company, section, description, startDate, finishDate, isActive } = req.body;

		experience.title = title;
		experience.company = company;
		experience.section = section;
		experience.description = description;
		experience.startDate = startDate;
		experience.finishDate = finishDate;
		if (typeof isActive === 'boolean') experience.isActive = isActive;

		// title: string;
		// company: string;
		// section: string;
		// description: string;
		// startDate: Date;
		// finishDate: Date | String;
		// isActive: boolean;

		await experience.save();
		res.status(httpStatus.CREATED).json(experience);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const experience = await Experience.findOne({ _id: req.params.id });
		if (!experience) throw new ApiError(httpStatus.NOT_FOUND, 'Experience not found');
		await experience.deleteOne();
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getById, post, updateById, deleteById };

export default { get, getById, post, updateById, deleteById };