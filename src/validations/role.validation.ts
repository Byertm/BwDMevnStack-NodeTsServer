import Joi from 'joi';

const roleValidationSchema = Joi.object({ name: Joi.string().min(3).required(), isActive: Joi.boolean().optional() });

export { roleValidationSchema };
export default roleValidationSchema;