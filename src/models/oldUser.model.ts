import mongoose, { Schema } from 'mongoose';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IOldUser extends IDocument {
	firstName: string;
	lastName: string;
	about: string;
	username: string;
	password: string;
	roleId: number;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	isBanned: boolean;
	isActive: boolean;
	phone?: string;
	website?: string;
	socialFacebook?: string;
	socialTwitter?: string;
	socialInstagram?: string;
	socialBehance?: string;
	socialDribble?: string;
	socialMedium?: string;
	socialGitHub?: string;
	socialGitLab?: string;
	socialBitbucket?: string;
}

export default interface IOldUserModel extends Document, IOldUser {}

const userSchema: Schema = new Schema(
	{
		firstName: { type: String, default: '' },
		lastName: { type: String, default: '' },
		about: { type: String, default: '' },
		username: { type: String, required: true },
		password: { type: String, required: true },
		roleId: { type: Number, default: 0 },
		createUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		updateUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		isBanned: { type: Boolean, default: false },
		isActive: { type: Boolean, default: false },
		// Bundan sonraki kısım düşünülecek
		phone: { type: String, default: '' },
		website: { type: String, default: '' },
		socialFacebook: { type: String, default: '' },
		socialTwitter: { type: String, default: '' },
		socialInstagram: { type: String, default: '' },
		socialBehance: { type: String, default: '' },
		socialDribble: { type: String, default: '' },
		socialMedium: { type: String, default: '' },
		socialGitHub: { type: String, default: '' },
		socialGitLab: { type: String, default: '' },
		socialBitbucket: { type: String, default: '' },
	},
	DefaultSchemaOptions
);

export const UserModel = mongoose.model<IOldUserModel>('user', userSchema);