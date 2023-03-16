import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IStore extends IDocument {
	name: string;
	description: string;
	image: string;
}

export default interface IStoreModel extends Document, IStore {}

const schema = new Schema(
	{
		name: { type: String, required: true, minlength: 3 },
		description: { type: String, required: true, maxlength: 500 },
		image: { type: String, required: true }
	},
	DefaultSchemaOptions
);

export const Store = model<IStoreModel>('Store', schema);