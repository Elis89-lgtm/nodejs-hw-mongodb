import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validate-body-middleware.js';
import { registerUserValidationSchema } from '../validation/registerUserValidationSchema.js';
import { loginUserValidationSchema } from '../validation/loginUserValidationSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserValidationSchema),
  registerUserController,
);
authRouter.post(
  '/login',
  validateBody(loginUserValidationSchema),
  loginUserController,
);
authRouter.post('/logout', logoutUserController);
authRouter.get('/refresh', refreshSessionController);
authRouter.post('/refresh-session', refreshSessionController);

export default authRouter;
