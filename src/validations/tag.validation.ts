import Joi from 'joi';

const tagValidationSchema = Joi.object({
	name: Joi.string().min(3).required(),
	url: Joi.string().allow('', null).optional(),
	createUserId: Joi.string().allow('', null).optional(),
	updateUserId: Joi.string().allow('', null).optional(),
	isActive: Joi.boolean().optional()
});

export { tagValidationSchema };
export default tagValidationSchema;