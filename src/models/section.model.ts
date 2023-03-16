import { Schema, Document, model, Model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface ISection extends IDocument {
	key: string;
	name: string;
	type: string;
	isActive: boolean;
	subSections?: Array<ISection>;
}

export default interface ISectionModel extends Document, ISection {}

const schema = new Schema<ISectionModel, Model<ISectionModel>>(
	{
		key: { type: String, unique: true, trim: true, required: true },
		name: { type: String, trim: true, required: true },
		type: { type: String, enum: ['page', 'section', 'post', 'sidebar'], default: 'section' },
		subSections: [{ type: Schema.Types.ObjectId, ref: 'Section' }] || null || undefined,
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

export const Section = model<ISectionModel>('Section', schema);