import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { generateAccessJWT, verifyRefreshJWT } from '@/middlewares/generateJWT';
import { EXAMPLE_SENDMAIL } from '@/middlewares/mail';
import { IUser, User } from '@/models/user.model';
import { Role } from '@/models/role.model';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const getAbout = async (_req: Request, res: Response) => {
	res.render('home', { contentText: 'Hakkında', title: 'Hakkında Sayfası', layout: 'main' });
};

const getContact = async (_req: Request, res: Response) => {
	res.render('home', { contentText: 'Contact', title: 'İletişim Sayfası', layout: 'main' });
};

const getTest = async (_req: Request, res: Response) => {
	res.render('test', { contentText: 'Test', title: 'Test Pages', layout: 'main' });
};

const getSendMail = async (_req: Request, res: Response) => {
	await EXAMPLE_SENDMAIL();
	res.render('home', { title: 'Mail Gönderildi', contentText: 'Mail Gönderildi', layout: 'main' });
};

const getHealthy = async (_req: Request, res: Response) => {
	res.render('healthy', { title: 'API is Healthy', contentText: 'Welcome to API', layout: 'main' });
};

// Refresh Token
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken, email } = req.body;
		const user = await User.findOne({ email });
		if (!user) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'User bulunmadı');
		// Bu kısım belki taşınabilir.
		// const verifyJwt = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
		console.log('refreshToken', refreshToken);
		const tokenVerify = verifyRefreshJWT(refreshToken);
		console.log('verifyJwt', tokenVerify);
		if (!tokenVerify) throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not verify, please a login');
		res.json(user.toAuthJSON());
	} catch (e) {
		next(e);
	}
};

// Note: Required in api request
const postLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
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

export { getTest, getAbout, getContact, getSendMail, getHealthy, postLogin, postRegister, getMe, getNotFound, refreshToken };
export default { getTest, getAbout, getContact, getSendMail, getHealthy, postLogin, postRegister, getMe, getNotFound, refreshToken };
