import express from 'express';
import { APP_PREFIX_PATH } from '@/config/config';
import adminRoutes from '@/routes/admin/admin.route';
import apiRoutes from '@/routes/api/api.route';
import auth from '@/routes/auth.route';

const router = express.Router();

router.use(`${APP_PREFIX_PATH}api/`, apiRoutes);
router.use(`${APP_PREFIX_PATH}admin/`, adminRoutes);
router.use(auth);

export default router;