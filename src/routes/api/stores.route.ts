import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/stores.controller';
import { JoiValidate } from '@/middlewares/joi-validate';
import storeValidationSchema from '@/validations/store.validation';

const router = express.Router();

router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.get);
router.get('/:id', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getById);
router.post('/', passport.authenticate(['jwt'], { session: false }), JoiValidate(storeValidationSchema), controller.post);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(storeValidationSchema), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;