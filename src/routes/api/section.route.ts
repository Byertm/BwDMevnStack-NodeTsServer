import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/section.controller';
import { JoiValidate } from '@/middlewares/joi-validate';
import sectionValidationSchema from '@/validations/section.validation';

const router = express.Router();

router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getAll);
router.get('/:key', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getSectionByKey);
router.get('/type/:type', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getSectionsByType);
router.get('/detail/:id', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getById);
router.post('/', passport.authenticate(['jwt'], { session: false }), JoiValidate(sectionValidationSchema), controller.post);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(sectionValidationSchema), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;