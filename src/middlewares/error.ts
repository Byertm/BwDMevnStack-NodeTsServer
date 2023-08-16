import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { IS_PRODUCTION, IS_TEST } from '@/config/config';
import ApiError, { IApiError } from '@/utils/ApiError';
import logger from '@/config/logger';

export const errorConverter: ErrorRequestHandler = (err: IApiError | mongoose.Error, _: Request, __: Response, next: NextFunction) => {
	let error = err;
	if (!(error instanceof ApiError)) {
		const statusCode = error instanceof mongoose.Error || error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
		const message = error.message || httpStatus[statusCode];
		error = new ApiError(statusCode, message as string, true, err.stack);
	}
	next(error);
};

export const errorHandler: ErrorRequestHandler = (err: ApiError, _: Request, res: Response) => {
	let { statusCode, message } = err;
	if (IS_PRODUCTION && !err.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}

	res.locals.errorMessage = err.message;

	const response = {
		code: statusCode,
		message,
		...(!IS_PRODUCTION && { stack: err.stack }),
	};

	if (!IS_PRODUCTION && !IS_TEST) {
		logger.error(err);
	}

	res.status(statusCode).send(response);
};