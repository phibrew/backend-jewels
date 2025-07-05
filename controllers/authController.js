import {User} from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Example controller for local registration
export const register = async (req, res) => {
  try {
    const { name, email} = req.body;
    
    // Create new user with password for local auth
    const user = await User.create({
      name,
      email,
    });
    
    // Generate tokens
    const token = user.generateAuthToken();
    
    res.status(201).json({  
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log("No token");
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      console.log("No user found");
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("Verified login for user", user.email);
    res.status(200).json({ user });
  } catch (err) {
    console.error("Invalid or expired token", err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};