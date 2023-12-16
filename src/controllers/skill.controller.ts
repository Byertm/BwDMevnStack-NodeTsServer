import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Skill } from '@/models/skill.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const skill = await Skill.find({});
		res.status(httpStatus.OK).json(skill);
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const skill = await Skill.findOne({ _id: req.params.id, isActive: true });
		if (!skill) throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found');
		res.status(httpStatus.OK).json(skill);
	} catch (e) {
		next(e);
	}
};

// const defaultSkillImageUrl: string = 'category/testfile';

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const skill = new Skill({ ...req.body });

		await skill.save();
		res.status(httpStatus.CREATED).json(skill);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const skill = await Skill.findOne({ _id: req.params.id });
		if (!skill) throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found');
		const { name, url, imgUrl, ratio, isSpecial, isLanguage, isActive } = req.body;

		if (name) skill.name = name;
		if (url) skill.url = url;
		if (imgUrl) skill.imgUrl = imgUrl;
		if (ratio) skill.ratio = ratio;
		if (typeof isSpecial === 'boolean') skill.isSpecial = isSpecial;
		if (typeof isLanguage === 'boolean') skill.isLanguage = isLanguage;
		if (typeof isActive === 'boolean') skill.isActive = isActive;

		await skill.save();
		res.status(httpStatus.OK).json(skill);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const skill = await Skill.findOne({ _id: req.params.id });
		if (!skill) throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found');
		const deleteQuery = skill.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getById, post, updateById, deleteById };

export default { get, getById, post, updateById, deleteById };