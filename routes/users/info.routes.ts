import { Router } from 'express';

import { addUser } from '../../controllers/UsersController';

const router = Router();

router.get('/me', addUser);

export default router;
