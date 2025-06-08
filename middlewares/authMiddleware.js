import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

export const isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'admin'){
        return next();
    }
    res.status(403).send('Access denied');
};

export const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return res.status(401).json({ message: 'Not authorized, no token' });
    }  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    } 
}

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    }
}