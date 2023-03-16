import { Request, Response, NextFunction, Handler } from 'express';
import httpStatus from 'http-status';
import logger from '@/config/logger';

export enum Role {
	admin = 'ADMIN',
	editor = 'EDITOR',
	visitor = 'VISITOR'
}

export type TypeRole = keyof typeof Role;

export type IsControlTypeOptions = {
	role?: TypeRole;
	roles?: TypeRole[];
};

export const isControl = (options?: IsControlTypeOptions): Handler => {
	return async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			logger.error('Access denied!');
			return res.status(httpStatus.FORBIDDEN).json({ message: 'User => Access denied!' });
		}

		// console.log('req.user=>', req.user);

		// const roles: TypeRole[] = ['admin', 'editor', 'visitor'];
		const roles: TypeRole[] = [];

		// if (!roles.includes(options.role) || !options.roles.every((role) => role.includes(role))) {
		// 	logger.error('Access denied!');
		// 	return res.status(httpStatus.FORBIDDEN).json({ message: 'Access denied!' });
		// }

		if (!!options && Object.keys(options).length > 0) {
			if (!options?.role && !options?.roles?.length) {
				logger.error('Access denied!');
				return res.status(httpStatus.FORBIDDEN).json({ message: 'Role And Roles => Access denied!' });
			}

			// if (options.role && !roles.includes(options.role)) {
			// 	roles.push(options.role);
			// 	logger.error('Access denied!');
			// 	return res.status(httpStatus.FORBIDDEN).json({ message: 'Role => Access denied!' });
			// }
			if (options.role) {
				roles.push(options.role);
			} else if (!options.roles) {
				logger.error('Access denied!');
				return res.status(httpStatus.FORBIDDEN).json({ message: 'Role => Access denied!' });
			}

			// if (options.roles && (options.roles.length <= 0 || !options?.roles?.some((role) => roles.includes(role)))) {
			// 	logger.error('Access denied!');
			// 	return res.status(httpStatus.FORBIDDEN).json({ message: 'Role => Access denied!' });
			// }
			if (options.roles) {
				if (!(options?.roles?.length <= 0)) {
					options?.roles?.forEach((role) => roles.push(role));
				} else {
					logger.error('Access denied!');
					return res.status(httpStatus.FORBIDDEN).json({ message: 'Roles => Access denied!' });
				}
			} else {
				logger.error('Access denied!');
				return res.status(httpStatus.FORBIDDEN).json({ message: 'Roles => Access denied!' });
			}

			next();
		}
		return res.status(httpStatus.FORBIDDEN).json({ message: 'Role And Roles => Access denied!' });
	};
};

//! Bu konu bakilacak.
//? Note: https://stackoverflow.com/questions/46147444/how-can-i-pass-parameters-to-a-generic-express-middleware-function-on-a-per-rout
// export const Role = async (options: any) => {
// 	return isControl.call.bind(options);
// };