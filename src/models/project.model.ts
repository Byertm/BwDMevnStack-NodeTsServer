import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IProject extends IDocument {
	name: string;
	slug: string;
	description: string;
	imageUrl: string;
	demoPreviewUrl: string;
	deployUrl: string;
	categoryId: string;
	startDate: Date;
	finishDate: Date;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	isActive: boolean;
}

export default interface IProjectModel extends Document, IProject {}

const schema = new Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, unique: true, trim: true, default: '', required: true },
		description: { type: String, required: true, default: '' },
		imageUrl: { type: String, default: '' },
		demoPreviewUrl: { type: String, default: '' },
		deployUrl: { type: String, default: '' },
		categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
		startDate: { type: Date, default: Date.now },
		finishDate: { type: Date, default: Date.now },
		createUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		updateUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

export const Project = model<IProjectModel>('Project', schema);