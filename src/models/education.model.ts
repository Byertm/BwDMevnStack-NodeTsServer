import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IEducation extends IDocument {
	title: string;
	scholl: string;
	section: string;
	description: string;
	startDate: Date;
	finishDate: Date | string;
	isActive: boolean;
}

export default interface IEducationModel extends Document, IEducation {}

const schema = new Schema(
	{
		title: { type: String, required: true },
		scholl: { type: String, required: true },
		section: { type: String, required: true },
		description: { type: String, required: true },
		startDate: { type: Date, required: true },
		finishDate: { type: Date || String, required: true },
		isActive: { type: Boolean, default: false },
	},
	DefaultSchemaOptions
);

export const Education = model<IEducationModel>('Education', schema);