import { join } from 'path';
import { readdirSync, lstatSync, writeFileSync } from 'fs';
import { open, mkdir, rm, rmdir } from 'fs/promises';
import type { Request, Response, NextFunction } from 'express';
import type { Stats, Dirent } from 'fs';
import { File } from '@/models/file.model';
import httpStatus from 'http-status';
import { UPLOAD_MAN_DIR } from '@/config/config';
import { FILE_PATH } from '@/config/config';
import { getHost, TypeOfs } from '@/utils/Helper';
import ApiError from '@/utils/ApiError';
import logger from '@/config/logger';

const localFilePath: string = UPLOAD_MAN_DIR || 'uploads/manager';

const byteConvertor = (byte: number, to: 'kb' | 'mb' | 'gb' | 'tb') => {
	const convert = {
		kb: (byte: number) => byte / 1000,
		mb: (byte: number) => byte / 1000 / 1000,
		gb: (byte: number) => byte / 1000 / 1000 / 1000,
		tb: (byte: number) => byte / 1000 / 1000 / 1000 / 1000
	};

	const convertedValue = convert[to](byte).toFixed(2);

	return convertedValue;
};

const setValidSize = (size: number) => {
	if (size <= 100000) return byteConvertor(size, 'kb') + 'Kb';
	if (size <= 100000000) return byteConvertor(size, 'mb') + 'Mb';
	if (size <= 100000000000) return byteConvertor(size, 'gb') + 'Gb';
	if (size <= 100000000000000) return byteConvertor(size, 'tb') + 'Tb';
	else return -1;
};

const setNameAndSuffix = (name: string, isDir: boolean) => {
	let suffix = '';

	if (!isDir) {
		suffix = name.split('.').at(-1);
		name = name.slice(0, name.search(suffix) - 1);
	}

	return { name, suffix };
};

const getContentPath = async (req: Request, res: Response) => {
	try {
		let { path } = req.body;

		if (!path) path = '';

		const checkSec = path.indexOf('../');

		if (checkSec !== -1) {
			res.status(403).json({ msg: 'security' });
			return;
		}

		let mainManagerContent: Array<Dirent> = readdirSync(join(process.cwd(), `${localFilePath}/`, path), { withFileTypes: true }) || [];

		const contents = mainManagerContent.map((dirent: Dirent) => {
			const info: Stats = lstatSync(join(process.cwd(), `${localFilePath}/`, path, dirent?.name));

			const { name, suffix } = setNameAndSuffix(dirent?.name, dirent?.isDirectory());
			const type = dirent?.isDirectory() ? 'directory' : 'file';

			return { name, suffix, size: type === 'file' ? setValidSize(info.size) : '', type };
		});

		res.status(httpStatus.OK).json(contents);
	} catch (err) {
		console.log(err);
		res.status(httpStatus.BAD_REQUEST).json({ msg: 'directory not exists' });
	}
};

const getContentByMiddlePath = async (req: Request, res: Response) => {
	try {
		let { path } = req.body;

		if (!path) res.status(httpStatus.NOT_FOUND).json({ msg: 'Böyle bir yol veya kategori bulunamadı!' });

		const checkSec = path.indexOf('../');

		if (checkSec !== -1) {
			res.status(403).json({ msg: 'security' });
			return;
		}

		let mainManagerContent: Array<Dirent> = readdirSync(join(process.cwd(), `${localFilePath}/`, path), { withFileTypes: true }) || [];

		const contents = mainManagerContent.map((dirent: Dirent) => {
			const info: Stats = lstatSync(join(process.cwd(), `${localFilePath}/`, path, dirent?.name));

			const { name, suffix } = setNameAndSuffix(dirent?.name, dirent?.isDirectory());
			const type = dirent?.isDirectory() ? 'directory' : 'file';

			return { name, suffix, size: type === 'file' ? setValidSize(info.size) : '', type };
		});

		const newContents = contents.filter((c) => c.type !== 'directory');

		res.status(httpStatus.OK).json(newContents);
	} catch (err) {
		console.log(err);
		res.status(httpStatus.BAD_REQUEST).json({ msg: 'directory not exists' });
	}
};

const uploadImageFile = async (req: Request, res: Response) => {
	const { path, name, imgBase64 } = req.body;

	const allowedMimeTypes = ['image/bmp', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/tiff', 'image/svg+xml'];
	const originalName = name?.split('.')?.[0] ?? name;
	const randomName = `${Date.now()}_${Math.random().toString(36)}_${originalName.trim()}`;
	let matches = imgBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
		response: any = {};

	if (matches.length !== 3) return new Error('Invalid input string');

	response.type = matches[1];
	response.data = Buffer.from(matches[2], 'base64');
	let { data: imageBuffer, type } = response;

	let extension = allowedMimeTypes.includes(type) ? type?.split?.('/')?.[1] || 'webp' : 'webp';
	let fileName = `${randomName}_image.${extension}`;

	if (!true) {
		console.log({ matches: matches });
		console.log({ imageBuffer: imageBuffer });
		console.log({ type: type });
		console.log({ extension: extension });
		console.log({ fileName: fileName });
		console.log({ joinedPath: join(process.cwd(), `${localFilePath}/`, path, fileName) });
		console.log({ imgBuffer: imageBuffer });
	}

	try {
		await writeFileSync(join(process.cwd(), `${localFilePath}/`, path, fileName), imageBuffer, 'utf8');
		return res.status(httpStatus.CREATED).json({ status: 'success' });
	} catch (e) {
		res.status(httpStatus.BAD_REQUEST).json({ msg: e });
	}
};

const createFile = (req: Request, res: Response) => {
	const { path, file } = req.body;

	open(join(process.cwd(), `${localFilePath}/`, path, file), 'w')
		.then(() => res.status(httpStatus.CREATED).json({ msg: 'ok' }))
		.catch((error) => res.status(httpStatus.BAD_REQUEST).json({ msg: error }));
};

const createDirectory = (req: Request, res: Response) => {
	const { path, directory } = req.body;

	mkdir(join(process.cwd(), `${localFilePath}/`, path, directory))
		.then(() => res.status(httpStatus.CREATED).json({ msg: 'ok' }))
		.catch((error) => res.status(httpStatus.BAD_REQUEST).json({ msg: error }));
};

const rmFileDirectory = (req: Request, res: Response) => {
	const { path, type } = req.body;

	if (type === 'file') {
		rm(join(process.cwd(), `${localFilePath}/`, path))
			.then(() => res.status(httpStatus.OK).json({ msg: 'ok' }))
			.catch((error) => res.status(httpStatus.BAD_REQUEST).json({ msg: error }));
	} else if (type === 'directory') {
		rmdir(join(process.cwd(), `${localFilePath}/`, path))
			.then(() => res.status(httpStatus.OK).json({ msg: 'ok' }))
			.catch((error) => res.status(httpStatus.BAD_REQUEST).json({ msg: error }));
	}
};

// Standart FormData File Upload
const defaultCategoryImageUrl: string = 'file/defaultImage.png';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log('Req File: ', req.file);
		console.log('Req Body: ', req.body);

		const reqFile = req.file;
		const file: any = new File({ ...req.body });

		if (!!reqFile) {
			const ip = await getHost(req);

			if (!!ip && TypeOfs.isString(ip)) file.url = `${FILE_PATH}/${reqFile.filename}`;
		} else file.url = defaultCategoryImageUrl;

		await file.save();
		res.status(httpStatus.CREATED).json(file);
	} catch (e) {
		next(e);
	}
};

const updateFileById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log('Req File: ', req.file);
		console.log('Req Body: ', req.body);

		const reqFile = req.file;
		const file: any = await File.findOne({ _id: req.params.id });
		// const file: any = new File({ ...req.body });

		if (!!reqFile) {
			const ip = await getHost(req);

			if (!!ip && TypeOfs.isString(ip)) file.url = `${FILE_PATH}/${reqFile.filename}`;
		} else file.url = defaultCategoryImageUrl;

		await file.save();
		res.status(httpStatus.CREATED).json(file);
	} catch (e) {
		next(e);
	}
};

const deleteFileById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const file: any = await File.findOne({ _id: req.params.id });
		if (!file) throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
		const deleteQuery = file.deleteOne();
		await deleteQuery;
		res.status(httpStatus.NO_CONTENT).send();
	} catch (e) {
		next(e);
	}
};

export { getContentPath, getContentByMiddlePath, uploadImageFile, createFile, createDirectory, rmFileDirectory, uploadFile, updateFileById, deleteFileById };
export default { getContentPath, getContentByMiddlePath, uploadImageFile, createFile, createDirectory, rmFileDirectory, uploadFile, updateFileById, deleteFileById };