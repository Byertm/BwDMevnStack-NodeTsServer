import { randFullName, randParagraph } from '@ngneat/falso';

import { IStore, Store } from './store.model';

describe('Store model', () => {
	let newStore: IStore;
	beforeEach(() => {
		newStore = {
			name: randFullName(),
			description: randParagraph(),
			image: randParagraph(),
			createAt: new Date(),
			updateAt: new Date(),
		};
	});

	it('should correctly validate', async () => {
		await expect(new Store(newStore).validate()).resolves.toBeUndefined();
	});

	it('should throw a validation error if name is empty', async () => {
		delete newStore.name;
		await expect(new Store(newStore).validate()).rejects.toThrow();
		newStore.name = '';
		await expect(new Store(newStore).validate()).rejects.toThrow();
	});

	it('should throw a validation error if name is less than 3 characters', async () => {
		newStore.name = 'xx';
		await expect(new Store(newStore).validate()).rejects.toThrow();
	});

	it('should throw a validation error if description is empty', async () => {
		delete newStore.description;
		await expect(new Store(newStore).validate()).rejects.toThrow();
		newStore.description = '';
		await expect(new Store(newStore).validate()).rejects.toThrow();
	});

	it('should throw a validation error if description is more than 500 characters', async () => {
		newStore.description = randParagraph({ length: 501 }).join(' ');
		await expect(new Store(newStore).validate()).rejects.toThrow();
	});

	it('should throw a validation error if image is empty', async () => {
		delete newStore.image;
		await expect(new Store(newStore).validate()).rejects.toThrow();
		newStore.image = '';
		await expect(new Store(newStore).validate()).rejects.toThrow();
	});
});