import Joi from 'joi';

const commentValidationSchema = Joi.object({
	comment: Joi.string().min(3).required(),
	postId: Joi.string().required(),
	parentId: Joi.string().allow('', null).optional(),
	author: Joi.string().allow('', null).default(null).optional(),
	createUserId: Joi.string().allow('', null).optional(),
	updateUserId: Joi.string().allow('', null).optional(),
	isBanned: Joi.boolean().optional(),
	isHidden: Joi.boolean().optional(),
	isActive: Joi.boolean().optional()
});

export { commentValidationSchema };
export default commentValidationSchema;