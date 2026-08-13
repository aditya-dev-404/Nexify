import express from 'express';
const router = express.Router();
import { login, logout, sendVerifyEmailOtp, signup, verifyOtp } from '../controllers/auth.controller.js';

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/sendverificationotp', sendVerifyEmailOtp);
router.post('/verifyotp', verifyOtp);

export default router;