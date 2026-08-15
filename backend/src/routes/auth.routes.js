import express from 'express';
const router = express.Router();
import { login, logout, sendResetPassOtp, sendVerifyEmailOtp, signup, verifyOtp,verifyResetPassOtp } from '../controllers/auth.controller.js';

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/sendverificationotp', sendVerifyEmailOtp);
router.post('/verifyotp', verifyOtp);
router.post('/sendpassresetotp', sendResetPassOtp);
router.post('/verifyresetpassotp', verifyResetPassOtp);

export default router;