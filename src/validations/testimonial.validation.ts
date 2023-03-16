import Joi from 'joi';

const testimonialValidationSchema = Joi.object({
	title: Joi.string().min(3).required(),
	content: Joi.string().min(3).required(),
	author: Joi.string().allow('', null).optional(),
	authorImage: Joi.string().min(3).optional(),
	createUserId: Joi.string().allow('', null).optional(),
	updateUserId: Joi.string().allow('', null).optional(),
	isActive: Joi.boolean().optional()
});

export { testimonialValidationSchema };
export default testimonialValidationSchema;