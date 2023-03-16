import { Router } from 'express';
import passport from 'passport';
import * as controller from '@/controllers/post.controller';
import { JoiValidate } from '@/middlewares/joi-validate';
import postValidationSchema from '@/validations/post.validation';

const router: Router = Router();

// Todo: Get isteğindeki anonymous daha sonra kaldırılacak.
router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.get);
router.get('/pagination', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getAllWithPagination);
router.get('/:id', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getById);
router.get('/detail/:slug', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getBySlug);
router.get('/category/:slug', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getAllByCategory);
router.get('/tag/:slug', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getAllByTag);
router.post('/', passport.authenticate(['jwt'], { session: false }), JoiValidate(postValidationSchema), controller.post);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(postValidationSchema), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;