import type { Model, SchemaOptions } from 'mongoose';
import type { Request, Response } from 'express';

export interface IDocument {
	createAt: Date;
	updateAt: Date;
}

export interface IDefaultSchemaOptions extends SchemaOptions {
	typeKey?: string; // 'type'
	id?: boolean; // true
	_id?: boolean; // true
	timestamps?: boolean; // true
	versionKey?: string | boolean; // '__v'
}

export const DefaultSchemaOptions: IDefaultSchemaOptions = {
	id: true,
	_id: true,
	timestamps: true,
	versionKey: false,
	toJSON: {
		virtuals: true,
		aliases: true,
		transform(_, ret) {
			ret.id = ret._id;
			delete ret._id;
		}
	},
	toObject: {
		virtuals: true,
		aliases: true,
		transform(_, ret) {
			ret.id = ret._id;
			delete ret._id;
		}
	}
};

export const slugify = (str: string) => {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, ' ')
		.trim()
		.replace(/\s+/g, '-');
};

export type PaginationResult = { skip: number; limit: number; pageNumber: number; totalCount: number; totalPages: number; hasPrev: boolean; hasNext: boolean };

export const paginationHelper = async (req: Request, res: Response, model: typeof Model): Promise<PaginationResult> => {
	const query = { skip: 0, limit: 5, pageNumber: 1, hasPrev: false, hasNext: true };
	let qPageNumber = parseInt(req.query.pageNumber as string | undefined, 10) || query.skip + 1;
	const qSize = parseInt(req.query.size as string | undefined, 10) || query.limit;

	if (qPageNumber <= 0) {
		// const response = { error: true, message: 'invalid page number, should start with 1' };
		// return res.json(response);
		qPageNumber = 1;
	}

	const totalCount = await model.countDocuments({});
	const totalPages = Math.ceil(totalCount / qSize);

	query.pageNumber = qPageNumber;
	query.skip = qSize * (qPageNumber - 1);

	query.hasNext = qPageNumber < totalPages;
	query.hasPrev = totalPages > 1 && qPageNumber > 1;

	if (totalCount <= query.skip) {
		query.skip = 0;
		query.pageNumber = qPageNumber > totalPages ? totalPages : 1;

		if (qPageNumber === totalPages) {
			query.hasPrev = false;
			query.hasNext = false;
		}
	}

	query.limit = qSize;

	const { skip, limit, pageNumber, hasPrev, hasNext } = query;

	return { skip, limit, pageNumber, hasPrev, hasNext, totalCount, totalPages };
};