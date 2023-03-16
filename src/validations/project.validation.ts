import Joi from 'joi';

const projectValidationSchema = Joi.object({
	name: Joi.string().min(3).required(),
	slug: Joi.string().allow('', null).optional(),
	description: Joi.string().min(3).max(1000).required(),
	imageUrl: Joi.string().allow('', null).optional(),
	demoPreviewUrl: Joi.string().allow('', null).optional(),
	deployUrl: Joi.string().allow('', null).optional(),
	categoryId: Joi.string().allow('', null).optional(),
	startDate: Joi.date().optional(),
	finishDate: Joi.date().optional(),
	createUserId: Joi.string().allow('', null).optional(),
	updateUserId: Joi.string().allow('', null).optional(),
	isActive: Joi.boolean().optional()
});

export { projectValidationSchema };
export default projectValidationSchema;