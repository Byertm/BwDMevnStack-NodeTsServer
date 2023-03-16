import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
// import type { IScocialMedia, ISectionOwner, ISectionOwnerContact, ISectionOwnerInfo } from '@/models/section.model';
import { Section } from '@/models/section.model';
import type ISectionModel from '@/models/section.model';
// import IUserModel, { User } from '@/models/user.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const getAll = async (req: Request, res: Response) => {
	// logger.debug('%o', req.user);
	const section = await Section.find({});
	res.status(httpStatus.OK).json(section);
};

const getSectionsByType = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const sections = await Section.find({ type: req.params.type, isActive: true });
		if (!sections) throw new ApiError(httpStatus.NOT_FOUND, 'Section not found');
		res.status(httpStatus.OK).json(sections);
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const section = await Section.findOne({ _id: req.params.id, isActive: true });
		if (!section) throw new ApiError(httpStatus.NOT_FOUND, 'Section not found');
		res.status(httpStatus.OK).json(section);
	} catch (e) {
		next(e);
	}
};

const getSectionByKey = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const section = await Section.findOne({ key: req.params.key });
		if (!section) throw new ApiError(httpStatus.NOT_FOUND, 'Section not found');
		res.status(httpStatus.OK).json(section);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const section = new Section({ ...req.body });
		await section.save();
		res.status(httpStatus.CREATED).json(section);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const section = await Section.findOne({ _id: req.params.id });
		if (!section) throw new ApiError(httpStatus.NOT_FOUND, 'Section not found');
		const { key, name, type, isActive, subSections }: Partial<ISectionModel> = req.body;

		if (key) section.key = key;
		if (name) section.name = name;
		if (type) section.type = type;
		if (subSections && !!subSections.length) section.subSections = subSections;
		if (typeof isActive === 'boolean') section.isActive = isActive;

		await section.save();
		res.status(httpStatus.OK).json(section);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const section = await Section.findOne({ _id: req.params.id });
		if (!section) throw new ApiError(httpStatus.NOT_FOUND, 'Section not found');
		await section.deleteOne();
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { getAll, getById, getSectionsByType, getSectionByKey, post, updateById, deleteById };

export default { getAll, getById, getSectionsByType, getSectionByKey, post, updateById, deleteById };