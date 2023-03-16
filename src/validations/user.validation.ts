import Joi from 'joi';

const userValidationSchema = Joi.object({
	first_name: Joi.string().min(3).required(),
	last_name: Joi.string().min(3).required(),
	email: Joi.string().email().required(),
	roles: Joi.array().allow(null).optional(),
	isActive: Joi.boolean().optional()
});

export { userValidationSchema };
export default userValidationSchema;