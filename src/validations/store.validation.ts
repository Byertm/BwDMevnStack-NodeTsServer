import Joi from 'joi';

const storeValidationSchema = Joi.object({
	name: Joi.string().min(3).required(),
	description: Joi.string().min(3).max(500).required(),
	image: Joi.string().min(3).required()
});

export { storeValidationSchema };
export default storeValidationSchema;