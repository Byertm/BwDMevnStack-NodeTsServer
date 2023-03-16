import Joi from 'joi';

const experienceValidationSchema = Joi.object({
	title: Joi.string().min(3).required(),
	company: Joi.string().min(3).required(),
	section: Joi.string().min(3).required(),
	description: Joi.string().min(3).required(),
	startDate: Joi.date().required(),
	finishDate: Joi.date().required(),
	isActive: Joi.boolean().optional()
});

export { experienceValidationSchema };
export default experienceValidationSchema;