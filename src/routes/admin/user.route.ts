import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/user.controller';

const router = express.Router();

router.get('/', passport.authenticate('localJWT', { session: false }), controller.get);
router.get('/login', controller.getLogin);
router.get('/register', controller.getRegister);
router.get('/forgotPassword', controller.getForgotPassword);
router.route('/logout').all(controller.allLogout);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);
router.get('/profile', passport.authenticate('localJWT', { session: false }), controller.getProfile);
router.get('*', controller.getNotFound);

export default router;