import Joi from 'joi';

const skillValidationSchema = Joi.object({
	name: Joi.string().min(3).required(),
	url: Joi.string().allow('', null).min(3).optional(),
	imgUrl: Joi.string().allow('', null).optional(),
	ratio: Joi.number().optional(),
	isSpecial: Joi.boolean().optional(),
	isLanguage: Joi.boolean().optional(),
	isActive: Joi.boolean().optional()
});

export { skillValidationSchema };
export default skillValidationSchema;