import { Router } from 'express';
import contactsRouter from './contacts.routers.js';
import authRouter from './auth.js';

const router = Router();
router.use('/contacts', contactsRouter);
router.use(authRouter);

export default router;
