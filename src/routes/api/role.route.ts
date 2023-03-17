import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/role.controller';
import { JoiValidate } from '@/middlewares/joi-validate';
import roleValidationSchema from '@/validations/role.validation';

const router = express.Router();

// Todo: Get isteğindeki anonymous daha sonra kaldırılacak.
router.get('/', passport.authenticate(['jwt'], { session: false }), controller.get);
router.get('/:id', passport.authenticate(['jwt'], { session: false }), controller.getById);
router.post('/', passport.authenticate(['jwt'], { session: false }), JoiValidate(roleValidationSchema), controller.post);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(roleValidationSchema), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;
