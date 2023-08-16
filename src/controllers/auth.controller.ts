import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { BODY_TEMPLATE, ContactFormValues, CONTACT_SENDMAIL } from '@/middlewares/mail';
import type { JwtPayload } from 'jsonwebtoken';
import { IUser, User } from '@/models/user.model';
import { Role } from '@/models/role.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const getIframe = async (req: Request, res: Response) => {
	const { prefix: pPrefix, url: pUrl } = req.params;
	const prefixAndUrl = `${pPrefix}/${pUrl}` || 'api/category';
	const url = `${req.protocol}://${req.headers.host}/${prefixAndUrl}`;

	const { protocol, headers, originalUrl, url: reqUrl, baseUrl } = req;

	res.render('iframe', { iframeSrc: url, request: JSON.stringify({ protocol, headers, originalUrl, url: reqUrl, baseUrl }), layout: 'main' });
};

const getAbout = async (_req: Request, res: Response) => {
	res.render('home', { contentText: 'Hakkında', title: 'Hakkında Sayfası', layout: 'main' });
};

const getContact = async (_req: Request, res: Response) => {
	res.render('home', { contentText: 'Contact', title: 'İletişim Sayfası', layout: 'main' });
};

const getTest = async (_req: Request, res: Response) => {
	res.render('test', { contentText: 'Test', title: 'Test Pages', layout: 'main' });
};

const sendMailTest = async (_req: Request, res: Response) => {
	await CONTACT_SENDMAIL('Bu bir test e-postasıdır.');
	res.render('home', { title: 'Mail Gönderildi', contentText: 'Mail Gönderildi', layout: 'main' });
};

const postSendContactMail = async (req: Request, res: Response) => {
	const { name, email, phone, subject, message } = req.body;
	const mailParams: ContactFormValues = { name, email, phone, subject, message };
	const mailBody: string = BODY_TEMPLATE(mailParams);
	await CONTACT_SENDMAIL(mailBody);
	res.send({ message: 'Mail Gönderildi', error: false });
};

const getHealthy = async (_req: Request, res: Response) => {
	res.render('healthy', { title: 'API is Healthy', contentText: 'Welcome to API', layout: 'main' });
};

// Refresh Token
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.body;
		const tokenVerify = await User.STA_VerifyRefreshJWT(refreshToken);
		if (!tokenVerify) throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not verify, please a login');
		const { email } = <JwtPayload>tokenVerify;
		console.log({ verifyJwt: tokenVerify, email });
		const user = await User.findOne({ email }).populate({ path: 'roles', match: { isActive: true }, select: '-_id name' });
		if (!user) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'User bulunmadı');
		res.json(user.toAuthJSON());
	} catch (e) {
		next(e);
	}
};

// Note: Required in api request
const postLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).populate({ path: 'roles', match: { isActive: true }, select: '-_id name' });
		if (!user || !user.validPassword(password)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid email or password');
		if (!user.isActive) throw new ApiError(httpStatus.UNAUTHORIZED, 'Kullanıcınız henüz aktif değil');
		if (!user.roles.length) throw new ApiError(httpStatus.UNAUTHORIZED, 'Kullanıcınız henüz bir role sahip değil. Lütfen bekleyiniz');
		res.json(user.toAuthJSON());
	} catch (e) {
		next(e);
	}
};

// Note: Required in api request
const postRegister = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { first_name, last_name, email, password, roles } = req.body;
		const user = new User();
		user.first_name = first_name;
		user.last_name = last_name;
		user.email = email;
		const role = await Role.findOne({ name: 'Visitor', isActive: true });
		// Burada role standart olarak visitor olarak veriliyor. Sonrasında yönetim panelinden diğer rol atamaları yapılacak.
		user.roles = !!role ? [role.id] : [];
		user.setPassword(password);
		await user.save();
		// Kullanıcı aktivitasyonu için e-posta gönderimi yapılması gerekiyor. Daha sonra e-posta üzerinden aktiflik kontrolü yapılacak.
		res.json(user.toAuthJSON());
	} catch (e) {
		if (e.name === 'MongoError') return res.status(httpStatus.BAD_REQUEST).send(e);
		next(e);
	}
};

const getMe = async (req: Request, res: Response) => {
	const { hash_password, salt, ...reqUser } = <IUser>req.user;
	res.send(reqUser); // req.user;
};

const getNotFound = async (req: Request, res: Response) => {
	res.render('not-found', { title: 'Not Found', contentText: 'Böyle bir rota bulunamadı!', url: req.url });

	logger.error(req.url);
};

export { getTest, getIframe, getAbout, getContact, sendMailTest, postSendContactMail, getHealthy, postLogin, postRegister, getMe, getNotFound, refreshToken };
export default { getTest, getIframe, getAbout, getContact, sendMailTest, postSendContactMail, getHealthy, postLogin, postRegister, getMe, getNotFound, refreshToken };