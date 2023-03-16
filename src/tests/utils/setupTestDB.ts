import mongoose from 'mongoose';
import { DB_URI } from '@/config/config';

const setupTestDB = () => {
	beforeAll(async () => {
		await mongoose.connect(DB_URI, {
			autoIndex: true,
			autoCreate: true,
			maxPoolSize: 10,
			connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		});
	});

	//! Todo: Buraya bakılacak.
	// beforeEach(async () => {
	// 	await Promise.all(
	// 		Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany({})),
	// 	);
	// });

	afterAll(async () => {
		await mongoose.disconnect();
	});
};

export default setupTestDB;
