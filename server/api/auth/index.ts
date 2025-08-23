// server/api/auth/index.ts
import { Router } from 'express';
import signupHandler from './signup';
import loginHandler from './login';
import validateHandler from './validate';

const router = Router();

// These routes will be available at /api/auth/signup, /api/auth/login, /api/auth/validate
router.post('/signup', signupHandler);
router.post('/login', loginHandler);
router.post('/validate', validateHandler);

export default router;