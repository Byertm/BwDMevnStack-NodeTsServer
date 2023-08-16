import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/skill.controller';
import { JoiValidate } from '@/middlewares/joi-validate';
import skillValidationSchema from '@/validations/skill.validation';

const router = express.Router();

router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.get);
router.get('/:id', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getById);
router.post('/', passport.authenticate(['jwt'], { session: false }), JoiValidate(skillValidationSchema), controller.post);
router.post('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(skillValidationSchema), controller.updateById);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(skillValidationSchema), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;