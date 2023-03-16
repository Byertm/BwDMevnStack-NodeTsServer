import Joi from 'joi';

// Todo: Buradaki örnekteki gibi diğer validasyon dosyalarıda düzenlenecek.
const postValidationSchema = Joi.object({
	title: Joi.string().min(3).required(),
	preTitle: Joi.string().min(3).required(),
	content: Joi.string().min(3).required(),
	slug: Joi.string().allow('', null).optional(),
	imageUrl: Joi.string().allow('', null).optional(),
	createUserId: Joi.string().allow('', null).optional(),
	updateUserId: Joi.string().allow('', null).optional(),
	author: Joi.string().allow('', null).optional(),
	category: Joi.string().allow('', null).optional(),
	tags: Joi.array().allow(null).optional(),
	comments: Joi.array().allow(null).optional(),
	isActive: Joi.boolean().optional()
});

export { postValidationSchema };
export default postValidationSchema;