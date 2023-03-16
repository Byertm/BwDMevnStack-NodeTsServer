import express from 'express';

import { category, comment, education, experience, file, post, project, role, skill, stores, tag, testimonial, user, site, section } from '@/routes/api/index.route';

const router = express.Router();

router.use('/category', category);
router.use('/comment', comment);
router.use('/education', education);
router.use('/experience', experience);
router.use('/post', post);
router.use('/project', project);
router.use('/role', role);
router.use('/skill', skill);
router.use('/stores', stores);
router.use('/tag', tag);
router.use('/testimonial', testimonial);
router.use('/user', user);
router.use('/file', file);
router.use('/site', site);
router.use('/section', section);

export default router;