import {User} from '../models/userModel.js';
import { createTransporter } from '../utils/mailer.js';

const otpStore = new Map();

const genrateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const otp = genrateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    otpStore.set(email, {otp, expires});

    try {
        const transporter = await createTransporter();
        await transporter.sendMail({
            from: `"THE KIPU JEWELS" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'OTP CODE',
            text: `Your OTP code is ${otp}`
        });
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
}

export const verifyOtp = async(req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
    
        const storedData = otpStore.get(email);
        if (!storedData) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }
    
        if (Date.now() > storedData.expires) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP expired' });
        }
    
        if (String (storedData.otp) !== String(otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    
        otpStore.delete(email);
        let user = await User.findOne({ email });
        if (!user) {
            //create one user if not exists
            user = new User({ email });
            await user.save();  
        }
        res.status(200).json({ message: 'OTP verified successfully', user });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
        
    }
}