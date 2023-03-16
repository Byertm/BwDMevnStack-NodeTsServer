import { Request, Response, NextFunction } from 'express';

// Todo: Tip ve veri kontrolleri yapılacak. Schema, Error gibi.
export const JoiValidate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
	const { value, error } = schema.validate(req.body);

	if (error) {
		console.log('JOI-Error => ', error);
		const msg: string = `${error.details[0].message}`;
		return res.send({ error: msg });
	}

	console.log('JOI-value => ', value);

	Object.assign(req, value);

	return next();
};