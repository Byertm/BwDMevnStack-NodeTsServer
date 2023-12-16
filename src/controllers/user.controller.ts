import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
// import passport from 'passport';
import type { IUser, IUserToAuthJSON } from '@/models/user.model';
import { IS_PRODUCTION } from '@/config/config';
import { User } from '@/models/user.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const PRIVATE_URI_SCHEME_REDIRECT = '/admin';

type RenderOption = { contentText: string; title: string; error?: unknown };

// Todo: Handlebars layout ve partials içinde user ve islogged bilgilerini okuma çözülecek.
const setLocalUser = (req: Request, res: Response, user: any | null | undefined) => {
	// console.log('_user', user);

	if (!!user?.name && !!user?.token) {
		const { token, refresh_token, roles, ...userInfo } = user;
		req.user = JSON.stringify(userInfo);
		res.locals.isLogged = true;
		res.locals.user = JSON.stringify(userInfo);
	} else {
		req.user = null;
		res.locals.isLogged = false;
		res.locals.user = null;
	}

	console.log({ user: user, reqUser: req.user, resLocalIsLogged: res.locals.isLogged, resLocalUser: res.locals.user });
};

const checkIsLogged = (req: Request, res: Response) => {
	return !!req.user || !!res.locals.isLogged;
};

const get = async (req: Request, res: Response) => {
	// res.status(httpStatus.OK).json({ message: 'Welcome a Admin', requestHeader: req.headers, reqCookie: req.cookies });
	res.render('home', { contentText: 'Admin Dashboard', title: 'Welcome', user: res.locals?.user || null, isLogged: res.locals?.isLogged || false, layout: 'main' });
};

const getLogin = async (req: Request, res: Response) => {
	// if (!!req.session.user && !!req.session.token) res.redirect(302, `/admin?token=JWT ${req.session.token}`);

	let renderOptions: RenderOption = { contentText: 'login page', title: 'Login' };
	if (res.locals.error) renderOptions.error = res.locals.error;
	res.render('pages/login', renderOptions);
};

const getRegister = async (_req: Request, res: Response) => {
	let renderOptions: RenderOption = { contentText: 'Register page', title: 'Register' };
	if (res.locals.error) renderOptions.error = res.locals.error;
	res.render('pages/register', renderOptions);
};

const getForgotPassword = async (_req: Request, res: Response) => {
	res.render('pages/forgot-password', { title: 'Forgot Password', contentText: 'Forgot Password Page' });
};

const allLogout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// ! Burada logout işlemleri yapılacak...
		req.headers.authorization = '';
		res.setHeader('Authorization', '');
		res.cookie('jwt', { maxAge: 0, expires: Date.now() });
		res.redirect('/admin/login');
	} catch (error) {
		next(error);
	}
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
	const { password, email } = req.body;
	const user = await User.findOne({ email, isActive: true }).populate({ path: 'roles', match: { isActive: true }, select: '-_id name' });

	let errorMessage = '';
	if (!user || !user.validPassword(password)) (errorMessage = 'Invalid email or password'), res.render('/admin/login', { error: errorMessage });
	if (!user.isActive) (errorMessage = 'Kullanıcınız henüz aktif değil'), res.render('/admin/login', { error: errorMessage });
	if (!user.roles.length) (errorMessage = 'Kullanıcınız henüz bir role sahip değil. Lütfen bekleyiniz'), res.render('/admin/login', { error: errorMessage });

	// return done(null, user.toAuthJSON());
	console.log({ user: user });

	const foundUser: IUserToAuthJSON = user?.toAuthJSON();
	console.log({ foundUser: foundUser });

	if (!!foundUser) {
		setLocalUser(req, res, foundUser);
		req.login(foundUser, { session: false }, (error: unknown) => {
			if (error) {
				res.locals.error = error;
				res.render(`${PRIVATE_URI_SCHEME_REDIRECT}/login`, { error });
			}
			res.cookie('jwt', foundUser.token, { httpOnly: IS_PRODUCTION, secure: IS_PRODUCTION }); // Note: Production'da secure true olmalı unutma!

			res.redirect('/admin');
		});
	}

	// return getLogin(req, res);
	// let renderOptions: RenderOption = { contentText: 'login page', title: 'Login' };
	// try {
	// 	// req.headers.authorization = `Bearer ${token}`;
	// 	// res.setHeader('Authorization', `Bearer ${token}`);

	// 	passport.authenticate('local', { session: false, failureRedirect: `${PRIVATE_URI_SCHEME_REDIRECT}/login` }, (error: any, _user: any) => {
	// 		if (error || !_user) res.status(400).json({ error });

	// 		/** This is what ends up in our JWT */
	// 		const payload = {
	// 			username: _user.email,
	// 			expires: Date.now() + 1000 * 60 * 10
	// 		};

	// 		/** Assigns payload to req.user */
	// 		req.login(payload, { session: false }, (error) => {
	// 			if (error) {
	// 				renderOptions.error = error;
	// 				res.render(`${PRIVATE_URI_SCHEME_REDIRECT}/login`, renderOptions);
	// 			}

	// 			/** Generate a signed json web token and return it in the response */
	// 			// const token = jwt.sign(JSON.stringify(payload), keys.secret);
	// 			const token = `${_user.token}`;

	// 			/** Assign our jwt to the cookie */
	// 			res.cookie('jwt', token, { httpOnly: IS_PRODUCTION, secure: IS_PRODUCTION }); // Note: Production'da secure true olmalı unutma!
	// 			setLocalUser(req, res, _user);
	// 			// res.status(httpStatus.OK).json({ username: payload.username });
	// 			res.redirect(httpStatus.FOUND, `${PRIVATE_URI_SCHEME_REDIRECT}`);
	// 		});
	// 	})(req, res);
	// } catch (e) {
	// 	setLocalUser(req, res, null);
	// 	res.locals.error = e;
	// 	if (res.locals.error) renderOptions.error = res.locals.error;
	// 	res.render(`${PRIVATE_URI_SCHEME_REDIRECT}/login`, renderOptions);
	// 	next(e);
	// }
};

const postRegister = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { first_name, last_name, email, password, roles } = req.body;
		const user = new User();
		user.first_name = first_name;
		user.last_name = last_name;
		user.email = email;
		user.roles = roles;
		user.isActive = false;
		user.setPassword(password);
		await user.save();
		const data = user.toAuthJSON();
		const token = data?.token ? data.token : '';
		req.headers.authorization = token;
		res.setHeader('authorization', token).redirect('/admin');
	} catch (e) {
		if (e.name === 'MongoError') return res.status(httpStatus.BAD_REQUEST).send(e);
		res.locals.error = e;
		next(e);
	}
};

const getProfile = async (req: Request, res: Response) => {
	let renderOptions: RenderOption = { contentText: 'login page', title: 'Login' };
	if (!!req.cookies?.jwt) {
		const { hash_password, salt, ...reqUser } = <IUser>req.user;
		// res.status(httpStatus.OK).send(reqUser);

		let userInfo = JSON.stringify(reqUser);
		res.render('code', { data: userInfo, title: 'My Information', layout: 'main' });
	} else {
		res.render(`${PRIVATE_URI_SCHEME_REDIRECT}/login`, renderOptions);
	}
};

const getNotFound = async (req: Request, res: Response) => {
	res.render('not-found', { title: 'Not Found', contentText: 'Böyle bir rota bulunamadı!', url: req.url });

	logger.error(req.url);
};

// ---New---

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		logger.debug('%o', req.user);
		const user = await User.find({}).populate('roles', '_id name'); // .populate({ path: 'roles', match: { isActive: true }, select: '-_id name' });
		const resUsers = user.map((u) => ({ id: u._id, first_name: u.first_name, last_name: u.last_name, name: u.name, email: u.email, roles: u.roles, isActive: u.isActive }));
		res.status(httpStatus.OK).json(resUsers);
	} catch (e) {
		next(e);
	}
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({ _id: req.params.id, isActive: true }); //.populate({ path: 'roles', match: { isActive: true }, select: '-_id name' });
		if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
		await user.populate('roles', '_id name');
		user.populated('roles');
		const resUser = { id: user._id, first_name: user.first_name, last_name: user.last_name, name: user.name, email: user.email, roles: user.roles, isActive: user.isActive };
		res.status(httpStatus.OK).json(resUser);
	} catch (e) {
		next(e);
	}
};

const post = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { first_name, last_name, email, password, roles, isActive } = req.body;
		const user = new User();
		user.first_name = first_name;
		user.last_name = last_name;
		user.email = email;
		user.roles = roles;
		if (typeof isActive === 'boolean') user.isActive = isActive;
		user.setPassword(password);
		// console.info({ METHOD: 'POST', User: user, ReqUser: req.user });
		await user.save();

		const isUser = await User.findOne({ email });
		if (!!isUser) {
			// user.name = user.name;
			// user.first_name = user.first_name; //! Todo: Bu kısım değişecek.
			// user.id = user.id;
			throw new ApiError(httpStatus.FOUND, 'User found');
			return;
		}

		const resUser = { first_name, last_name, email, roles, isActive };
		res.status(httpStatus.CREATED).json(resUser);
	} catch (e) {
		next(e);
	}
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
		const { first_name, last_name, email, roles, isActive } = req.body;

		user.first_name = first_name;
		user.last_name = last_name;
		user.email = email;
		user.roles = roles;
		user.isActive = isActive;

		// first_name: string;
		// last_name: string;
		// email: string;
		// hash_password: string;
		// salt: string;
		// roles: Types.ObjectId[];

		await user.save();

		const resUser = { first_name, last_name, email, roles };
		res.status(httpStatus.OK).json(resUser);
	} catch (e) {
		next(e);
	}
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
		const deleteQuery = user.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { allLogout, get, getLogin, getForgotPassword, getProfile, getNotFound, getRegister, postLogin, postRegister, getAll, getById, post, updateById, deleteById };

export default {
	allLogout,
	get,
	getLogin,
	getForgotPassword,
	getProfile,
	getNotFound,
	getRegister,
	postLogin,
	postRegister,
	getAll,
	getById,
	post,
	updateById,
	deleteById
};