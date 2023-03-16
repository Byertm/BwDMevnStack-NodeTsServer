import express from 'express';

import { user } from '@/routes/admin/index.route';

const router = express.Router();

router.use('/', user);

export default router;