import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface ITag extends IDocument {
	name: string;
	slug: string;
	url: string;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	isActive: boolean;
}

export default interface ITagModel extends Document, ITag {}

const schema = new Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, unique: true, trim: true, default: '', required: true },
		url: { type: String, default: '' },
		createUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		updateUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

export const Tag = model<ITagModel>('Tag', schema);