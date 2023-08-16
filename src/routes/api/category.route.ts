import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/category.controller';
import categoryValidationSchema from '@/validations/category.validation';
import { JoiValidate } from '@/middlewares/joi-validate';

const router = express.Router();

router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.get);
router.get('/pagination', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getAllWithPagination);
router.get('/:id', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getById);
// Todo: Burada alt ana kategoriler, alt kategoriler ve onun altındaki kategoriler için endpointler yazılmalı.
router.post('/', passport.authenticate(['jwt'], { session: false }), JoiValidate(categoryValidationSchema), controller.post);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(categoryValidationSchema), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;