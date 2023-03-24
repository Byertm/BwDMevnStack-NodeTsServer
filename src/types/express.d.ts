// import { IUserToAuthJSON } from '@/models/user.model';

declare global {
	export namespace Express {
		// import {  Types } from 'mongoose';

		// export interface User {
		// 	id?: Types.ObjectId;
		// }

		export interface Request {
			// user?: User | undefined;
			// user?: IUserToAuthJSON | User | undefined;
			// users?: { id: string | number };
		}
	}
}

// declare module 'express-session' {
// 	interface SessionData {
// 		user: any;
// 		token: any;
// 	}
// }

export {};

// declare global {
//     namespace Express {
//         interface AuthInfo {}
//         interface User {}

//         interface Request {
//             authInfo?: AuthInfo | undefined;
//             user?: User | undefined;
