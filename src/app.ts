import express, { Express, Request, Response, NextFunction } from 'express';
import { engine as hbsEngine } from 'express-handlebars';
import { join, resolve } from 'path';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import serverless from 'serverless-http';
import compression from 'compression';
import session from 'express-session';
import httpStatus from 'http-status';
import passport from 'passport';
// import xss from 'xss-clean'
import helmet from 'helmet';
import debug from 'debug';
import cors from 'cors';
import routes from '@/routes';
import { morganSuccessHandler, morganErrorHandler } from '@/config/morgan';
import { errorConverter, errorHandler } from '@/middlewares/error';
import { anonymousStrategy, jwtLocalStrategy, jwtStrategy, localStrategy } from '@/config/passport';
import {
	APP_PORT,
	APP_PREFIX_PATH,
	ASSETS_PATH,
	ASSETS_PATH_SLUG,
	CORS_OPTIONS,
	FILE_CACHE_TIME,
	FILE_PATH,
	IMAGE_PATH_SLUG,
	IS_TEST,
	JWT_SECRET,
	PUBLIC_PATH,
	PUBLIC_PATH_SLUG,
	UPLOAD_DIR,
	UPLOAD_MAN_DIR
} from '@/config/config';
import { createUploadDir } from '@/utils/Helper';
import swaggerDocs from '@/utils/swagger';
import ApiError from '@/utils/ApiError';

const app: Express = express();

export const debugLog: debug.IDebugger = debug('app');

app.disable('x-powered-by');

// Set Handlebars Configs
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));
app.set('assets', join(__dirname, 'assets'));
app.engine('hbs', hbsEngine({ defaultLayout: 'auth', extname: 'hbs', layoutsDir: join(__dirname, 'views/layouts'), partialsDir: join(__dirname, 'views/partials') }));

passport.use(jwtStrategy);
passport.use(localStrategy);
passport.use(anonymousStrategy);
passport.use('localJWT', jwtLocalStrategy);

app.use(passport.initialize());
app.use(session({ secret: JWT_SECRET, resave: false, saveUninitialized: true })); //express-session
// app.use(passport.session()); //express-session

if (!IS_TEST) {
	app.use(morganSuccessHandler);
	app.use(morganErrorHandler);
}

// Set security HTTP headers
app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));
// ! Buraya bakılacak.
// const scriptSources = ["'self'", 'https://ssl.google-analytics.com', 'https://www.pagespeed-mod.com', 'https://buttons.github.io'];
// const styleSources = ["'self'", 'https://fonts.googleapis.com'];
// app.use(helmet.contentSecurityPolicy({ directives: { scriptSrc: scriptSources, styleSrc: styleSources } }));

// Swagger UI Integration
swaggerDocs(app, APP_PORT);

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Parse json request body
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser(JWT_SECRET));

// Sanitize request data
// app.use(xss())
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Cors
app.use(cors(CORS_OPTIONS));

// Assets Settings
app.use(express.static(join(process.cwd(), PUBLIC_PATH))); // * => public
app.use('/uploads/manager', express.static(join(process.cwd(), UPLOAD_MAN_DIR))); // /images => uploads/images
app.use(IMAGE_PATH_SLUG, express.static(join(process.cwd(), FILE_PATH))); // /images => uploads/images
app.use(PUBLIC_PATH_SLUG, express.static(join(process.cwd(), PUBLIC_PATH), { etag: false, maxAge: FILE_CACHE_TIME })); // public => public
app.use(ASSETS_PATH_SLUG, express.static(join(process.cwd(), ASSETS_PATH), { etag: false, maxAge: FILE_CACHE_TIME })); // assets => public/assets
// app.use(UPLOAD_MAN_DIR, express.static(join(process.cwd(), UPLOAD_MAN_DIR), { etag: false, maxAge: FILE_CACHE_TIME })); // uploads/manager => /uploads/manager

// Upload Setting
// app.use(`/${FILE_PATH}`, express.static(join(process.cwd(), FILE_PATH), { etag: false, maxAge: FILE_CACHE_TIME })); // /uploads/images => /uploads/images

// app.use(`${UPLOAD_MAN_DIR}`, express.static(join(process.cwd(), UPLOAD_MAN_DIR), { etag: false, maxAge: FILE_CACHE_TIME })); // /uploads/manager => /uploads/manager

console.log({
	'${process.cwd()}': `${process.cwd()}`,
	'${FILE_PATH}': `${FILE_PATH}`,
	'${PUBLIC_PATH_SLUG}': `${PUBLIC_PATH}`,
	'${ASSETS_PATH_SLUG}': `${ASSETS_PATH}`,
	'${UPLOAD_MAN_DIR}': `${UPLOAD_MAN_DIR}`,
	'${UPLOAD_MAN_DIR}Joined': `${join(process.cwd(), UPLOAD_MAN_DIR)}`
});

// Route to display static src images
// app.get('/assets', (_req, res) => {	res.render('assets'); });

app.get(`${IMAGE_PATH_SLUG}/*`, (req: Request, res: Response) => {
	console.log(`/${IMAGE_PATH_SLUG}/*`, req.originalUrl);
	res.sendFile(resolve(resolve(join(process.cwd(), req.originalUrl))));
});

app.get(`/${FILE_PATH}/*`, (req: Request, res: Response) => {
	console.log(`/${FILE_PATH}/*`, req.originalUrl);
	res.sendFile(resolve(resolve(join(process.cwd(), req.originalUrl))));
});

// ?Note: Bu endpointe düşmüyor kontrol edilmeli.
// app.get(`${UPLOAD_MAN_DIR}/*`, (req: Request, res: Response) => {
app.get(`uploads/manager/*`, (req: Request, res: Response) => {
	console.log(`/${UPLOAD_MAN_DIR}/*`, req.originalUrl);
	res.sendFile(resolve(resolve(join(process.cwd(), req.originalUrl))));
});

// Upload Directory Exist Control
createUploadDir(UPLOAD_DIR);

//Belki silinebilir.
createUploadDir(UPLOAD_MAN_DIR);

app.get(APP_PREFIX_PATH, (_req: Request, res: Response) => {
	res.redirect('/healthy');
});

// app.use((req: Request, res: Response, next: NextFunction) => {
// 	res.locals.session = req.session;
// 	console.log(res.locals.session);
// 	next();
// });

app.use(APP_PREFIX_PATH, routes);
// Todo: Netlify Fuctions Araştırılacak.
app.use('/.netlify/functions/server', routes);

// Send back a 404 error for any unknown api request
app.use((_req: Request, _res: Response, next: NextFunction) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

export const handler = serverless(app);

export default app;
