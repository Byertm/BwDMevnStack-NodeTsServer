import { Request, Response, NextFunction, Handler } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/config/config';
import logger from '@/config/logger';

export const isAuth: Handler = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) res.status(httpStatus.UNAUTHORIZED).json({ error: 'Access denied. No token provided!' });
	logger.error('Access denied. No token provided!');

	const token = authHeader && authHeader?.split(' ')?.[1];
	if (!!token) {
		try {
			const decodedToken = await jwt.verify(token, JWT_SECRET);
			req.user = decodedToken;
			logger.info(`decodedToken: ${decodedToken}`);
		} catch (error) {
			//? Token exprired için özel bir kontrol olacaktı onu dene!!!
			logger.error('Token expired');
			return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Token expired' });
		}

		next();
	}

	return res.send({ error: 'Please provide a token' });
};