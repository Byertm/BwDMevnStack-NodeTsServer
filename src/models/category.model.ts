import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface ICategory extends IDocument {
	name: string;
	url: string;
	slug: string;
	parentId: string | null;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	isActive: boolean;
}

export default interface ICategoryModel extends Document, ICategory {}

const schema = new Schema(
	{
		name: { type: String, trim: true, required: true, minlength: 3 },
		url: { type: String, trim: true, required: true },
		slug: { type: String, unique: true, trim: true, default: '', required: true },
		parentId: {
			type: Schema.Types.ObjectId || null,
			ref: 'Category',
			default: null,
			required: false
		},
		createUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		updateUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

// schema.pre('save', async function (next) {
// 	this.slug = slugify(this.name);
// 	next();
// });

export const Category = model<ICategoryModel>('Category', schema);