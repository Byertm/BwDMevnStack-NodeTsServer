import Joi from 'joi';

// Todo: Buradaki örnekteki gibi diğer validasyon dosyalarıda düzenlenecek.
const sectionValidationSchema = Joi.object({
	key: Joi.string().min(3).required(),
	name: Joi.string().min(3).required(),
	type: Joi.string().required(),
	subSections: Joi.array().allow(null).optional(),
	isActive: Joi.boolean().optional()
});

// key: string;
// name: string;
// type: string;
// isActive: boolean;
// subSections?: Array<ISection>;

export { sectionValidationSchema };
export default sectionValidationSchema;