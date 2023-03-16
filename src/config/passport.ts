import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import { IStrategyOptions, Strategy as LocalStrategy } from 'passport-local';
import { JWT_SECRET } from '@/config/config';
import { User } from '@/models/user.model';

export interface JWTPayload {
	id: string;
	name: string;
	email: string;
	iat: number;
	exp: number;
}

const jwtStrategyOptions: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET
};

export const jwtStrategy = new JwtStrategy(jwtStrategyOptions, async (payload: JWTPayload, done: VerifiedCallback) => {
	try {
		const user = await User.findById(payload.id);
		if (!user) return done(null, false);
		// Todo!: Token verify işlemi nerede sağlanıyor bakılacak.
		done(null, user.toJSON());
	} catch (e) {
		return done(e);
	}
});

export const anonymousStrategy: AnonymousStrategy = new AnonymousStrategy();

const localStrategyOptions: IStrategyOptions = {
	passReqToCallback: false,
	session: false,
	usernameField: 'email',
	passwordField: 'password'
};

export const localStrategy = new LocalStrategy(localStrategyOptions, async (email, password, done) => {
	try {
		// const user = await User.findOne({ username: username });
		// if (!user) return done(null, false);

		const user = await User.findOne({ email: email });
		if (!user || !user.validPassword(password)) done('Invalid email or password');
		if (!user.isActive) done('Kullanıcınız henüz aktif değil');
		if (!user.roles.length) done('Kullanıcınız henüz bir role sahip değil. Lütfen bekleyiniz');
		return done(null, user.toAuthJSON());
	} catch (error) {
		done(error);
	}
});

const cookieExtractor = (req: any) => {
	let jwt = null;

	if (req && req.cookies) jwt = req.cookies['jwt'];

	return jwt;
};

const jwtLocalStrategyOptions: StrategyOptions = {
	jwtFromRequest: cookieExtractor,
	secretOrKey: JWT_SECRET
};

export const jwtLocalStrategy = new JwtStrategy(jwtLocalStrategyOptions, async (payload: JWTPayload, done: VerifiedCallback) => {
	try {
		// if (Date.now() > payload?.exp) return done('jwt expired');

		const user = await User.findById(payload.id);
		if (!user) return done(null, false);
		done(null, user.toJSON());
		// done(null, payload);
	} catch (e) {
		return done(e);
	}
});