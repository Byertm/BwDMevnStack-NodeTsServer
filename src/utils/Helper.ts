import fs from 'fs';
import os from 'os';
import dns from 'dns';
import type { Request } from 'express';
export * as TypeOfs from '@/utils/TypeOfs';

const getWriteConseleFromRequestProps = (req: Request) => {
	console.log('FILE_PATH reg - Start');

	console.log('req.protocol: ', req.protocol); // http or https
	console.log('req.hostname: ', req.hostname); // only hostname (abc.com, localhost, etc)
	console.log('req.headers: ', req.headers.host); // hostname with port number (if any)
	console.log('req.header: ', req.header('host')); // <same as above>
	console.log('req.route: ', req.route.path); // exact defined route
	console.log('req.baseUrl: ', req.baseUrl); // base path or group prefix
	console.log('req.path: ', req.path); // relative path except path
	console.log('req.url: ', req.url); // relative path with query|search params
	console.log('req.originalUrl: ', req.originalUrl); // baseURL + url

	// Full URL
	console.log('Full URL: ', `${req.protocol}://${req.header('host')}${req.originalUrl}`);
	console.log('FILE_PATH reg - Finish');
};

const createUploadDir = (str: string) => {
	if (!fs.existsSync(str)) {
		fs.mkdirSync(str, { recursive: true });
	}
};

const getHost = async (req?: Request) => {
	return new Promise((resolve, reject) => {
		dns.lookup(os.hostname(), (err, ip) => {
			if (err) reject(err);

			const preLink: string = req && req.path ? `${req.protocol}://${req.header('host')}` : `http://${ip}`;

			// console.log(`${req.protocol}://${req.header('host')}${req.originalUrl}`);
			// resolve(`http://${ip}:${process.env.APP_PORT}`);
			resolve(`${preLink}:${process.env.APP_PORT}`);
		});
	});
};

const deleteFileFromDisk = (fileName: string, prePath: string = 'uploads/images') => {
	// console.log('fileName', fileName);
	if (fs.existsSync(`${prePath}/${fileName}`)) {
		fs.unlink(`${prePath}/${fileName}`, (err) => {
			if (err) return false;
			return true;
		});
	}
	return true;
};

export { createUploadDir, deleteFileFromDisk, getHost, getWriteConseleFromRequestProps };

export default { createUploadDir, deleteFileFromDisk, getHost, getWriteConseleFromRequestProps };