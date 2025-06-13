import { Router } from 'express';
import contactsRouter from './students.js';

const router = Router();
router.use(contactsRouter);

export default router;
