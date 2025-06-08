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

await setupPassport(); // Call the function to set up passport
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//middleware
app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
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
app.use('/', router);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
