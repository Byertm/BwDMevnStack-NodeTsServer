import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Testimonial } from '@/models/testimonial.model';
import IUserModel, { User } from '@/models/user.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const testimonial = await Testimonial.find({});
		res.status(httpStatus.OK).json(testimonial);
		// res.render('code', { data: testimonial, layout: 'main' });
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const testimonial = await Testimonial.findOne({ _id: req.params.id, isActive: true });
		if (!testimonial) throw new ApiError(httpStatus.NOT_FOUND, 'Testimonial not found');
		res.status(httpStatus.OK).json(testimonial);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const testimonial = new Testimonial({ ...req.body });

		const { email } = <IUserModel>req.user;
		const user = await User.findOne({ email });
		if (!!user) {
			testimonial.author = user.name;
			testimonial.authorImage = user.first_name; //! Todo: Bu kısım değişecek.
			testimonial.createUserId = user.id;
		}

		await testimonial.save();
		res.status(httpStatus.CREATED).json(testimonial);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const testimonial = await Testimonial.findOne({ _id: req.params.id });
		if (!testimonial) throw new ApiError(httpStatus.NOT_FOUND, 'Testimonial not found');
		const { title, content, author, authorImage, isActive } = req.body;

		if (title) testimonial.title = title;
		if (content) testimonial.content = content;
		if (author) testimonial.author = author;
		if (authorImage) testimonial.authorImage = authorImage;
		if (typeof isActive === 'boolean') testimonial.isActive = isActive;

		const { email } = <IUserModel>req.user;
		const user = await User.findOne({ email });
		if (!!user) testimonial.updateUserId = user.id;

		await testimonial.save();
		res.status(httpStatus.OK).json(testimonial);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const testimonial = await Testimonial.findOne({ _id: req.params.id });
		if (!testimonial) throw new ApiError(httpStatus.NOT_FOUND, 'Testimonial not found');
		const deleteQuery = testimonial.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getById, post, updateById, deleteById };

export default { get, getById, post, updateById, deleteById };