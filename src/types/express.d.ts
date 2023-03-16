declare global {
	export namespace Express {
		// import {  Types } from 'mongoose';

		// export interface User {
		// 	id?: Types.ObjectId;
		// }

		export interface Request {
			users?: { id: string | number };
			// user?: User | undefined;
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