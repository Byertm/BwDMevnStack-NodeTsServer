import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/comment.controller';
import { JoiValidate } from '@/middlewares/joi-validate';
import commentValidationSchema from '@/validations/comment.validation';

const router = express.Router();

router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.get);
router.get('/:id', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getById);
router.get('/post/:postId', passport.authenticate(['jwt', 'anonymous'], { session: false }), controller.getAllByPostId);
router.post('/', passport.authenticate(['jwt'], { session: false }), JoiValidate(commentValidationSchema), controller.post);
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), JoiValidate(commentValidationSchema), controller.updateById);
router.delete('/:id', passport.authenticate(['jwt'], { session: false }), controller.deleteById);

export default router;