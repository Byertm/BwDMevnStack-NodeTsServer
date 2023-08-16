import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/auth.controller';

const router = express.Router();

router.get('/i/:prefix/:url', controller.getIframe);
router.get('/about', controller.getAbout);
router.get('/contact', controller.getContact);
router.get('/test', controller.getTest);
router.get('/sendmail', controller.sendMailTest);
router.get('/healthy', controller.getHealthy);
router.post('/contact', controller.postSendContactMail);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);
router.post('/refreshToken', controller.refreshToken);
// , isControl({ roles: ['admin', 'editor', 'visitor'] })
router.get('/me', passport.authenticate('jwt', { session: false }), controller.getMe);
router.get('*', controller.getNotFound);

export default router;