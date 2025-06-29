import {Router} from 'express';
import {sendOtp, verifyOtp} from '../middlewares/otpMiddleware.js';

const authRouter = Router();

authRouter.post('/send-otp', sendOtp);

authRouter.post('/verify-otp', verifyOtp);

export default authRouter;