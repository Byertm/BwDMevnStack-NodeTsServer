import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
// import type { IScocialMedia, ISiteOwner, ISiteOwnerContact, ISiteOwnerInfo } from '@/models/site.model';
import { Site } from '@/models/site.model';
import type ISiteModel from '@/models/site.model';
// import IUserModel, { User } from '@/models/user.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const site = await Site.findOne({});
		res.status(httpStatus.OK).json(site);
	} catch (e) {
		next(e);
	}
};

const getAll = async (req: Request, res: Response) => {
	logger.debug('%o', req.user);
	const site = await Site.find({});
	res.status(httpStatus.OK).json(site);
};

const getById = async (req: Request, res: Response, next: NextFunction) => {

	try {
		const site = await Site.findOne({ _id: req.params.id });
		if (!site) throw new ApiError(httpStatus.NOT_FOUND, 'Site not found');
		res.status(httpStatus.OK).json(site);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const site = new Site({ ...req.body });

		// const { email } = <IUserModel>req.user;
		// const user = await User.findOne({ email });
		// if (!!user) {
		// 	site.owner = { firstName: user.first_name, lastName: user.last_name, fullName: user.name, birthDate: '' };
		// 	site.logo = { text: '', imageUrl: '' };
		// 	site.sections = user.id;
		// }

		await site.save();
		res.status(httpStatus.CREATED).json(site);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const site = await Site.findOne({ _id: req.params.id });
		if (!site) throw new ApiError(httpStatus.NOT_FOUND, 'Site not found');
		const { owner, logo }: Partial<ISiteModel> = req.body;

		if (owner) site.owner = { ...site.owner, ...owner };
		if (logo) site.logo = { ...site.logo, ...logo };

		// const { email } = <IUserModel>req.user;
		// const user = await User.findOne({ email });

		// const "site": ISite = {} as ISite;
		// site?.owner?.firstName;
		// site?.owner?.lastName;
		// site?.owner?.fullName;
		// site?.owner?.birthDate;
		// site?.owner?.info?.about?.title;
		// site?.owner?.info?.about?.short;
		// site?.owner?.info?.about?.full;
		// site?.owner?.info?.about?.imageUrl;
		// site?.owner?.info?.about?.videoUrl;
		// site?.owner?.info?.titles?.map((t) => t.name);
		// site?.owner?.info?.titles?.map((t) => t.icon);
		// site?.owner?.contacts?.address?.short;
		// site?.owner?.contacts?.address?.full;
		// site?.owner?.contacts?.address?.lonlat;
		// site?.owner?.contacts?.email;
		// site?.owner?.contacts?.phone;
		// site?.owner?.contacts?.website;
		// site?.owner?.socialMedias?.map((sm) => sm.name);
		// site?.owner?.socialMedias?.map((sm) => sm.icon);
		// site?.owner?.socialMedias?.map((sm) => sm.url);
		// site?.logo?.text;
		// site?.logo?.imageUrl;
		// site?.sections?.map((sec) => sec.key);
		// site?.sections?.map((sec) => sec.name);
		// site?.sections?.map((sec) => sec.isVisible);

		// const contacts = { address: { full: '', lonlat: '', short: '' }, email: '', phone: '', website: '' } as ISiteOwnerContact;
		// const info = {
		// 	about: { full: '', short: '', imageUrl: '', title: '', videoUrl: '' },
		// 	titles: [{ name: '', icon: '' }]
		// } as ISiteOwnerInfo;
		// const socialMedia = { name: '', icon: '', url: '' } as IScocialMedia;
		// const socialMedias = [socialMedia] as IScocialMedia[];

		// const _owner: ISiteOwner = {
		// 	firstName: '',
		// 	lastName: '',
		// 	fullName: '',
		// 	birthDate: '',
		// 	contacts: { address: { full: '', lonlat: '', short: '' }, email: '', phone: '', website: '' },
		// 	info: {
		// 		about: { full: '', short: '', imageUrl: '', title: '', videoUrl: '' },
		// 		titles: [{ name: '', icon: '' }]
		// 	},
		// 	socialMedias: [{ name: '', icon: '', url: '' }]
		// };
		// const logo = { text: '', imageUrl: ''};
		// const section = { key: '', name: '', isVisible: true };

		await site.save();
		res.status(httpStatus.OK).json(site);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const site = await Site.findOne({ _id: req.params.id });
		if (!site) throw new ApiError(httpStatus.NOT_FOUND, 'Site not found');
		const deleteQuery = site.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { get, getAll, getById, post, updateById, deleteById };

export default { get, getAll, getById, post, updateById, deleteById };