import * as dotenv from 'dotenv';

dotenv.config();

export const DOTENV = dotenv;
export const ENVIRONMENT = process.env.APP_ENV || 'development';
export const IS_PRODUCTION = ENVIRONMENT === 'prod' || ENVIRONMENT === 'production';
export const IS_STAGING = ENVIRONMENT === 'stage' || ENVIRONMENT === 'staging';
export const IS_DEBUG = process.env.DEBUG || true;
export const IS_TEST = ENVIRONMENT === 'test';
export const APP_PORT = Number(process.env.PORT) || Number(process.env.APP_PORT) || 9000;
export const APP_PREFIX_PATH = process.env.APP_PREFIX_PATH || '/';
export const JWT_SECRET = process.env.JWT_SECRET || 'a6faf5c877dbca5a7303beeaf89400ed4d8bbdd40b708ca78eb23535245ccdf3';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dae8585898d59e858c1e14309c8d2ca716948eb614a1ea82f4bf688b55d9f1d0';
export const SESSION_SECRET = process.env.SESSION_SECRET || '0e5ab7d52f18ab5174e6ff8d83d74f098b4fadb19369bfa43df758fa029ef466';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
export const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '1d';
export const DB = {
	USER: process.env.DB_USER,
	PASSWORD: process.env.DB_USER_PWD,
	HOST: process.env.DB_HOST,
	NAME: process.env.DB_NAME,
	PORT: Number(process.env.DB_PORT) || 27017
};
export const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/Mocks';
export const APP_URI = `${process.env.APP_URI}:${APP_PORT}` || `http://localhost:${APP_PORT}`;
export const NODEMAILER_AUTH_EMAIL = process.env.NM_AUTH_EMAIL || 'abc@gmail.com';
export const NODEMAILER_AUTH_PASSWORD = process.env.NM_AUTH_PASS || 'ikjzaufrikeisxyr123';
export const PUBLIC_PATH = process.env.PUBLIC_PATH || 'public';
export const PUBLIC_PATH_SLUG = process.env.PUBLIC_PATH_SLUG || '/public';
export const ASSETS_PATH = process.env.ASSETS_PATH || 'assets';
export const ASSETS_PATH_SLUG = process.env.ASSETS_PATH_SLUG || '/assets';
export const FILE_PATH = process.env.FILE_PATH || 'uploads/images';
export const FILE_PATH_SLUG = process.env.FILE_PATH_SLUG || '/uploads';
export const FILE_MAX_SIZE = process.env.FILE_MAX_SIZE || 2097152;
export const FILE_CACHE_TIME = process.env.FILE_CACHE_TIME || 1440000;
export const IMAGE_PATH_SLUG = process.env.IMAGE_PATH_SLUG || '/images';
export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/images';
export const UPLOAD_MAN_DIR = process.env.UPLOAD_MAN_DIR || 'uploads/manager';

const getWhiteListDomains = () => {
	const ADMIN_PROJECT_LINKS = [
		'https://bwd-mevn-stack-admin.vercel.app/',
		'https://bwd-mevn-stack-admin.vercel.app',
		'https://eb-admin.netlify.app/',
		'https://eb-admin.netlify.app'
	];
	const FRONT_PROJECT_LINKS = ['https://bwd-mevn-stack-front.vercel.app/', 'https://bwd-mevn-stack-front.vercel.app', 'https://eb-ws.netlify.app/', 'https://eb-ws.netlify.app'];
	const LOCAL_DEV_LINKS_AND_PORTS = ['http://localhost/', 'http://localhost'];

	if (!IS_PRODUCTION) {
		const localPorts: Array<number> = [3000, 4173, 4174, 5173, 5174, 5175, 8080, 9000];
		localPorts.forEach((port) => LOCAL_DEV_LINKS_AND_PORTS.push(`http://localhost:${port.toString()}`));
	}

	const INITIAL_CORS_ORIGINS = [...ADMIN_PROJECT_LINKS, ...FRONT_PROJECT_LINKS, ...LOCAL_DEV_LINKS_AND_PORTS];
	const allowedDomains: Array<string> = typeof process.env?.CORS_ORIGINS === 'string' ? JSON.parse(process.env.CORS_ORIGINS) : INITIAL_CORS_ORIGINS || INITIAL_CORS_ORIGINS;

	return allowedDomains;
};

export const AllowedOriginDomains: Array<string> = getWhiteListDomains();

export const corsOriginControl = (origin: string, callback: (a: unknown, b: boolean) => void) => {
	if (!origin) return callback(null, true);

	if (AllowedOriginDomains.indexOf(origin) === -1) {
		const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
		return callback(new Error(msg), false);
	}
	return callback(null, true);
};

export const CORS_OPTIONS = {
	origin: [...AllowedOriginDomains],
	credentials: true,
	preflightContinue: true,
	optionsSuccessStatus: 204
};
