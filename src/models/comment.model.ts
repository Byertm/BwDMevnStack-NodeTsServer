import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IComment extends IDocument {
	comment: string;
	author: string;
	postId: string;
	parentId: string | null | undefined;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	isBanned: boolean;
	isHidden: boolean;
	isActive: boolean;
	children?: Array<IComment> | null;
}

export default interface ICommentModel extends Document, IComment {}

const schema = new Schema(
	{
		comment: { type: String, required: true },
		author: { type: Schema.Types.ObjectId || null, ref: 'User', default: null, required: false },
		postId: { type: Schema.Types.ObjectId, ref: 'Post' },
		parentId: { type: Schema.Types.ObjectId || null, ref: 'Comment', default: null, required: false },
		createUserId: { type: Schema.Types.ObjectId || null, ref: 'User', default: null, required: false },
		updateUserId: { type: Schema.Types.ObjectId || null, ref: 'User', default: null, required: false },
		isBanned: { type: Boolean, default: false },
		isHidden: { type: Boolean, default: false },
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

// Note: Bu middleware gibi örnekler araştırılacak.
// schema.pre('find', function (next) {
// 	this.populate({ path: 'postId', select: 'title slug author isActive' })
// 		.populate({ path: 'createUserId', select: 'first_name last_name name email' })
// 		.populate({ path: 'updateUserId', select: 'first_name last_name name email' });

// 	next();
// });

export const Comment = model<ICommentModel>('Comment', schema);