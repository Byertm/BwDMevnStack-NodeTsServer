import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_EXPIRE, JWT_REFRESH_EXPIRE, JWT_REFRESH_SECRET, JWT_SECRET } from '@/config/config';

const generateAccessJWT = (user: any) => {
	return jwt.sign({ id: user._id, name: user.name, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

const generateRefreshJWT = (user: any) => {
	return jwt.sign({ id: user._id, name: user.name, email: user.email, roles: user.roles }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });
};

const verifyJWT = function (token: string): JwtPayload | string {
	return jwt.verify(token, JWT_SECRET);
};

const verifyRefreshJWT = function (token: string): JwtPayload | string {
	return jwt.verify(token, JWT_REFRESH_SECRET);
};

export { generateAccessJWT, generateRefreshJWT, verifyJWT, verifyRefreshJWT };
export default { generateAccessJWT, generateRefreshJWT, verifyJWT, verifyRefreshJWT };