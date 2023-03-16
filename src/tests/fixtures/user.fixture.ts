import { randFirstName, randLastName, randEmail } from '@ngneat/falso';

const password = 'superpassword';

export const user = {
	first_name: randFirstName(),
	last_name: randLastName(),
	email: randEmail(),
	password,
};
