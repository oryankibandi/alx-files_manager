import { Router } from 'express';

import { addUser, getMe } from '../../controllers/UsersController';

const router = Router();

router.post('/', addUser);
router.get('/me', getMe);

export default router;
