import mongoose, { ConnectOptions } from 'mongoose';
import { APP_PORT, APP_URI, DB, DB_URI, IS_TEST } from '@/config/config';
import logger from '@/config/logger';
import app, { debugLog } from '@/app';

let dbURI: string;
if (DB.HOST && DB.NAME && DB.PASSWORD && DB.USER) {
	dbURI = `mongodb://${DB.USER}:${encodeURIComponent(DB.PASSWORD)}@${DB.HOST}:${DB.PORT}/${DB.NAME}`;
} else dbURI = DB_URI;

if (IS_TEST) dbURI += '-test';

const mongooseOptions: ConnectOptions = {
	autoIndex: true,
	autoCreate: true,
	maxPoolSize: 10, // Maintain up to 10 socket connections
	connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
	socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};

logger.debug(dbURI);
logger.info('connecting to database...');

mongoose.set('strictQuery', false);

mongoose
	.connect(dbURI, mongooseOptions)
	.then(() => {
		logger.info('Mongoose connection done');

		app.listen(APP_PORT, () => {
			debugLog(`Server running at ${APP_URI}`);
			logger.info(`server listening on ${APP_PORT}`);
			logger.info(`Server Healty: ${APP_URI}`);
		});
	})
	.catch((e) => {
		logger.info('Mongoose connection error');
		logger.error(e);
	});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
	logger.debug('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
	logger.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
	logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection (ctrl + c)
process.on('SIGINT', () => {
	mongoose.connection.close().then(() => {
		logger.info('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

process.on('SIGTERM', () => {
	logger.info('SIGTERM signal received.');

	// server.close((err) => {
	// 	logger.info('Http server closed.');
	// 	process.exit(err ? 1 : 0);
	// });
});

process.on('uncaughtException', (err) => {
	logger.error('Uncaught Exception: ' + err);
});
