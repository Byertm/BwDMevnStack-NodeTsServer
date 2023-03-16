import { Schema, Document, model } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface ISkill extends IDocument {
	name: string;
	url: string;
	imgUrl: string;
	ratio: number;
	isSpecial: boolean;
	isLanguage: boolean;
	isActive: boolean;
}

export default interface ISkillModel extends Document, ISkill {}

const schema = new Schema(
	{
		name: { type: String, required: true },
		url: { type: String, default: '' },
		imgUrl: { type: String, default: '' },
		ratio: { type: Number, default: 0 },
		isSpecial: { type: Boolean, default: false },
		isLanguage: { type: Boolean, default: false },
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

export const Skill = model<ISkillModel>('Skill', schema);