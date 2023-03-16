import winston, { Logger, format, transports } from 'winston';
// import expressWinston from 'express-winston';
// import { IS_DEBUG, IS_PRODUCTION } from '@/config/config';
import { IS_PRODUCTION } from '@/config/config';

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const logger: Logger = winston.createLogger({
	level: IS_PRODUCTION ? 'info' : 'debug',
	format: winston.format.combine(
		enumerateErrorFormat(),
		format.colorize(),
		format.splat(),
		format.printf(({ level, message }) => `${level}: ${message}`)
	),
	transports: [new transports.Console({ stderrLevels: ['error'] })],
});

winston.format.prettyPrint(), winston.format.colorize({ all: true });

// ! Buraya bakılacak.
// const logger2 = expressWinston.logger({
// 	level: IS_PRODUCTION ? 'info' : 'debug',
// 	format: winston.format.combine(
// 		enumerateErrorFormat(),
// 		format.colorize(),
// 		format.splat(),
// 		format.json(),
// 		format.prettyPrint(),
// 		format.colorize({ all: true }),
// 		format.printf(({ level, message }) => `${level}: ${message}`)
// 	),
// 	meta: IS_DEBUG ? true : false, // optional: control whether you want to log the meta data about the request (default to true) // when not debugging, log requests as one-liners
// 	msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
// 	expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
// 	colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
// 	ignoreRoute: function (req, res) {
// 		return false;
// 	}, // optional: allows to skip some log messages based on request and/or response
// 	transports: [new transports.Console()],
// });

export default logger;