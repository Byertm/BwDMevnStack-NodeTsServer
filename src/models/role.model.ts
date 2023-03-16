import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IRole extends IDocument {
	name: string;
	isActive: boolean;
}

export default interface IRoleModel extends Document, IRole {}

const schema = new Schema(
	{
		name: { type: String, unique: true, trim: true, required: true },
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

// schema.virtual('id').get(function (this: IRoleModel) {
// 	return this._id;
// });

export const Role = model<IRoleModel>('Role', schema);