import express from 'express';
import passport from 'passport';
import * as controller from '@/controllers/file.controller';
import { JoiValidate } from '@/middlewares/joi-validate';
// import fileValidationSchema from '@/validations/file.validation';
import upload from '@/middlewares/imageUpload';

const router = express.Router();

router.get('/', passport.authenticate(['jwt'], { session: false }), controller.getContentPath);
router.post('/getContent', passport.authenticate(['jwt'], { session: false }), controller.getContentPath);
router.post('/getCategoryContent', passport.authenticate(['jwt'], { session: false }), controller.getContentByMiddlePath);
router.post('/uploadImageFile', passport.authenticate(['jwt'], { session: false }), controller.uploadImageFile);
router.post('/createFile', passport.authenticate(['jwt'], { session: false }), controller.createFile);
router.post('/createDirectory', passport.authenticate(['jwt'], { session: false }), controller.createDirectory);
router.delete('/remove', passport.authenticate(['jwt'], { session: false }), controller.rmFileDirectory);

router.post('/:id', passport.authenticate(['jwt'], { session: false }), [upload.single('photo')], controller.uploadFile); //, JoiValidate(fileValidationSchema)
router.patch('/:id', passport.authenticate(['jwt'], { session: false }), [upload.single('photo')], controller.updateFileById); //, JoiValidate(fileValidationSchema)
router.delete('/remove', passport.authenticate(['jwt'], { session: false }), controller.deleteFileById);

export default router;
