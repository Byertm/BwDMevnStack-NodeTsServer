import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/site.controller';
// import { JoiValidate } from '@/middlewares/joi-validate';
// import siteValidationSchema from '@/validations/site.validation';

const router = express.Router();

router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.get);
router.get('/all', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getAll);
router.get('/:id', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getById);
router.post('/', passport.authenticate(['jwt'], { session: false }), controller.post);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;
