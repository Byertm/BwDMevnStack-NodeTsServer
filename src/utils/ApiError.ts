export interface IApiError {
	name: string;
	message: string;
	stack?: string;
	statusCode: number;
	isOperational: boolean;
}

export class ApiError extends Error {
	statusCode: number;
	isOperational: boolean;

	constructor(statusCode: number, message: string, isOperational = true, stack = '') {
		super(message);

		this.statusCode = statusCode;
		this.isOperational = isOperational;

		if (stack) this.stack = stack;
		else Error.captureStackTrace(this, this.constructor);
	}
}

export default ApiError;