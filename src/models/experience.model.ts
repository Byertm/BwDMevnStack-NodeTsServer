import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IExperience extends IDocument {
	title: string;
	company: string;
	section: string;
	description: string;
	startDate: Date;
	finishDate: Date | string;
	isActive: boolean;
}

export default interface IExperienceModel extends Document, IExperience {}

const schema = new Schema(
	{
		title: { type: String, required: true },
		company: { type: String, required: true },
		section: { type: String, required: true },
		description: { type: String, required: true },
		startDate: { type: Date, required: true },
		finishDate: { type: Date || String, required: true },
		isActive: { type: Boolean, default: false },
	},
	DefaultSchemaOptions
);

export const Experience = model<IExperienceModel>('Experience', schema);