import Joi from 'joi';

const educationValidationSchema = Joi.object({
	title: Joi.string().min(3).required(),
	scholl: Joi.string().min(3).required(),
	section: Joi.string().min(3).required(),
	description: Joi.string().min(3).required(),
	startDate: Joi.date().required(),
	finishDate: Joi.date().required(),
	isActive: Joi.boolean().optional()
});

export { educationValidationSchema };
export default educationValidationSchema;