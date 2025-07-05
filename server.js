import dotenv from 'dotenv';
dotenv.config();  

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupPassport } from './config/passport.js'; // Import the passport configuration file
import RateLimit from 'express-rate-limit';

var limiter = RateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, // 100 requests per windowMs
})

app.use(limiter);

await setupPassport(); // Call the function to set up passport
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//middleware
app.use(cors({origin: "http://localhost:5173", credentials: true})); // Allow CORS for the specified origin and allow credentials
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            sameSite: 'lax' // or 'none' if using HTTPS + cross-origin
        }
    })
)
app.use(passport.initialize());
app.use(passport.session());
//connect to MongoDB
(async ()=> {
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_URL}`);
        if (connect) {
            console.log('MongoDB connected:', connect.connection.host);
        } else {
            throw new Error('MongoDB connection failed');
        }
    }
    catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the process with failure
    }
})();

//routes
import router from './routes/routes.js';
import authRouter from './routes/authRouter.js'; // Import the authentication routes
app.use('/', router);
app.use('/otp', authRouter); // Use the same router for authentication routes
//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
