import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IPost extends IDocument {
	title: string;
	slug: string;
	preTitle: string;
	content: string;
	imageUrl: string;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	author: Schema.Types.ObjectId | null | undefined;
	category: Schema.Types.ObjectId | null | undefined;
	tags: Array<string>;
	comments: Array<Schema.Types.ObjectId> | null | undefined;
	isActive: boolean;
	// Like ve Comment gösteriminin nasıl yapılacağı düşünülecek.
}

export default interface IPostModel extends Document, IPost {}

const schema = new Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, unique: true, trim: true, default: '', required: true },
		preTitle: { type: String, required: true },
		content: { type: String, required: true },
		imageUrl: { type: String, default: '' },
		author: { type: Schema.Types.ObjectId || null || undefined, ref: 'User', default: null, required: false },
		createUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		updateUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		category: { type: Schema.Types.ObjectId || null || undefined, ref: 'Category', default: null, required: false },
		// comments: { type: Array<Schema.Types.ObjectId> || null || undefined, ref: 'Comment', default: null, required: false },
		// comments: { type: Array<{ type: Schema.Types.ObjectId; ref: 'Comment' }> || null || undefined, default: null, required: false },
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] || null || undefined,
		// tags: { type: Array, default: [] },
		// tags: { type: Array<{ type: Schema.Types.ObjectId; ref: 'Tag' }> || null || undefined, default: null, required: false },
		tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }] || null || undefined,
		// recipients: [{ type: Schema.ObjectId, ref: 'User' }],
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

export const Post = model<IPostModel>('Post', schema);