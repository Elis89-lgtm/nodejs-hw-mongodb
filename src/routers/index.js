import { Router } from 'express';
import contactsRouter from './contacts.routers.js';

const router = Router();
router.use('/contacts', contactsRouter);

export default router;
