import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/education.controller';
import { JoiValidate } from '@/middlewares/joi-validate';
import educationValidationSchema from '@/validations/education.validation';

const router = express.Router();

router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.get);
router.get('/:id', controller.getById);
router.post('/', passport.authenticate(['jwt'], { session: false }), JoiValidate(educationValidationSchema), controller.post);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(educationValidationSchema), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;