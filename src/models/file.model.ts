import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IFile extends IDocument {
	name: string;
	originalName: string;
	url: string;
	// slug: string;
	categoryName: string | null;
	size: string | null;
	suffix: string | null;
	// createUserId: string | null | undefined;
	// updateUserId: string | null | undefined;
	isActive: boolean;
}

export default interface IFileModel extends Document, IFile {}

const schema = new Schema(
	{
		name: { type: String, trim: true, required: true, minlength: 3 },
		originalName: { type: String, trim: true, required: true, minlength: 3 },
		url: { type: String, trim: true, required: true },
		categoryName: { type: String, trim: true, required: true },
		size: { type: String },
		suffix: { type: String },
		// slug: { type: String, unique: true, trim: true, default: '', required: true },
		// parentId: { type: Schema.Types.ObjectId || null, ref: 'File', default: null, required: false },
		// createUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		// updateUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

// schema.pre('save', async function (next) {
// 	this.slug = slugify(this.name);
// 	next();
// });

export const File = model<IFileModel>('File', schema);