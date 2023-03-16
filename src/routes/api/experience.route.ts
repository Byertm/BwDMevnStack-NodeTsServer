import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/experience.controller';
import { JoiValidate } from '@/middlewares/joi-validate';
import experienceValidationSchema from '@/validations/experience.validation';

const router = express.Router();

router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.get);
router.get('/:id', controller.getById);
router.post('/', passport.authenticate(['jwt'], { session: false }), JoiValidate(experienceValidationSchema), controller.post);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(experienceValidationSchema), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;