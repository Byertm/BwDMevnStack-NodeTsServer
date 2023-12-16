import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Project } from '@/models/project.model';
import { slugify } from '@/models/mixin';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const project = await Project.find({})
			.populate({ path: 'categoryId', select: 'name url parentId' })
			.populate({ path: 'createUserId', select: 'name email' })
			.populate({ path: 'updateUserId', select: 'name email' });
		res.status(httpStatus.OK).json(project);
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const project = await Project.findOne({ _id: req.params.id, isActive: true });
		if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
		res.status(httpStatus.OK).json(project);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const project = new Project({ ...req.body });
		project.slug = slugify(req.body.name);

		await project.save();
		res.status(httpStatus.CREATED).json(project);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const project = await Project.findOne({ _id: req.params.id });
		if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
		const { name, description, demoPreviewUrl, deployUrl, imageUrl, categoryId, startDate, finishDate, updateUserId, isActive } = req.body;

		if (name) {
			project.name = name;
			project.slug = slugify(name);
		}
		if (description) project.description = description;
		if (demoPreviewUrl) project.demoPreviewUrl = demoPreviewUrl;
		if (deployUrl) project.deployUrl = deployUrl;
		if (imageUrl) project.imageUrl = imageUrl;
		if (categoryId) project.categoryId = categoryId;
		if (startDate) project.startDate = startDate;
		if (finishDate) project.finishDate = finishDate;
		if (updateUserId) project.updateUserId = updateUserId;
		if (typeof isActive === 'boolean') project.isActive = isActive;

		await project.save();
		res.status(httpStatus.OK).json(project);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const project = await Project.findOne({ _id: req.params.id });
		if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
		const deleteQuery = project.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getById, post, updateById, deleteById };

export default { get, getById, post, updateById, deleteById };