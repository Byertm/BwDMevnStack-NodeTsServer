import { Schema, Document, model, Types, Model } from 'mongoose';
// import uniqueValidator from 'mongoose-unique-validator';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_EXPIRE, JWT_REFRESH_EXPIRE, JWT_REFRESH_SECRET, JWT_SECRET } from '@/config/config';
import { DefaultSchemaOptions, IDocument } from '@/models/mixin';

export interface IUser {
	first_name: string;
	last_name: string;
	email: string;
	hash_password: string;
	salt: string;
	roles: Types.ObjectId[];
	isActive: boolean;
}

export interface IUserToAuthJSON extends IDocument {
	first_name: string;
	last_name: string;
	name: string;
	email: string;
	token?: string;
	refresh_token?: string;
	roles: Types.ObjectId[];
	isActive: boolean;
}

export default interface IUserModel extends Document, IUser {
	setPassword(password: string): void;
	validPassword(password: string): boolean;
	toAuthJSON(): IUserToAuthJSON;
	generateJWT(): string;
	generateAccessJWT(): string;
	verifyJWT(token: string): JwtPayload | string;
	verifyRefreshJWT(token: string): JwtPayload | string;
	name: string;
}

export interface IUserModelExtended extends Model<IUserModel> {
	STA_VerifyAccessJWT(token: string): JwtPayload | string;
	STA_VerifyRefreshJWT(token: string): JwtPayload | string;
	STA_VerifyJWT(token: string, jwtType: 'accessToken' | 'refreshToken'): JwtPayload | string;
	getIsValidUserByUserEmail(email: string): Promise<boolean>;
	getUser(email: string): Promise<IUserToAuthJSON>;
}

const schema = new Schema<IUserModel>(
	{
		first_name: { type: String, required: true, minlength: 3 },
		last_name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		hash_password: { type: String, private: true },
		roles: [{ type: Types.ObjectId, ref: 'Role' }],
		salt: { type: String, private: true },
		isActive: { type: Boolean, default: false }
	},
	DefaultSchemaOptions
);

// Plugins
//! Todo: Buraya bakılacak.
// schema.plugin(uniqueValidator);

schema.virtual('name').get(function (this: IUserModel) {
	return `${this.first_name} ${this.last_name}`;
});

schema.methods.setPassword = function (password: string) {
	this.salt = bcrypt.genSaltSync(16);
	this.hash_password = bcrypt.hashSync(password, this.salt);
};

schema.methods.validPassword = function (password: string): boolean {
	return bcrypt.compareSync(password, this.hash_password);
};

schema.methods.generateJWT = function (): string {
	return jwt.sign({ id: this._id, name: this.name, email: this.email, roles: this.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

schema.methods.generateRefreshJWT = function (): string {
	return jwt.sign({ id: this._id, name: this.name, email: this.email, roles: this.roles }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });
};

schema.methods.verifyJWT = function (token: string): JwtPayload | string {
	return jwt.verify(token, JWT_SECRET);
};

schema.methods.verifyRefreshJWT = function (token: string): JwtPayload | string {
	return jwt.verify(token, JWT_REFRESH_SECRET);
};

schema.methods.toAuthJSON = function (): IUserToAuthJSON {
	const { first_name, last_name, name, email, roles } = this;
	return { name, first_name, last_name, email, roles, token: this.generateJWT(), refresh_token: this.generateRefreshJWT() } as IUserToAuthJSON;
};

schema.statics.getIsValidUserByUserEmail = async function (email: string): Promise<boolean> {
	const user = await User.findOne({ email });
	return !!user;
};

schema.statics.getUser = async function (email: string): Promise<IUserModel> {
	return await User.findOne({ email });
};

schema.statics.STA_VerifyAccessJWT = function (token: string): JwtPayload | string {
	return jwt.verify(token, JWT_SECRET);
};

schema.statics.STA_VerifyRefreshJWT = function (token: string): JwtPayload | string {
	return jwt.verify(token, JWT_REFRESH_SECRET);
};

schema.statics.STA_VerifyJWT = function (token: string, jwtType: 'accessToken' | 'refreshToken'): JwtPayload | string {
	return jwt.verify(token, jwtType === 'accessToken' ? JWT_SECRET : JWT_REFRESH_SECRET);
	// return jwtType === 'accessToken' ? User.STA_VerifyAccessJWT() : User.STA_VerifyRefreshJWT();
};

export const User = model<IUserModel, IUserModelExtended>('User', schema);