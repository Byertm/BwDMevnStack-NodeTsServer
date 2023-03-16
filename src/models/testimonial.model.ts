import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface ITestimonial extends IDocument {
	title: string;
	content: string;
	author: string;
	authorImage: string;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	isActive: boolean;
}

export default interface ITestimonialModel extends Document, ITestimonial {}

const schema = new Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		authorImage: { type: String, default: '' },
		author: { type: String, default: '' },
		createUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		updateUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

export const Testimonial = model<ITestimonialModel>('Testimonial', schema);