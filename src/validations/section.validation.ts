import Joi from 'joi';

const sectionValidationSchema = Joi.object({
	key: Joi.string().min(3).required(),
	name: Joi.string().min(3).required(),
	type: Joi.string().required(),
	subSections: Joi.array().allow(null).optional(),
	isActive: Joi.boolean().optional()
});

export { sectionValidationSchema };
export default sectionValidationSchema;
