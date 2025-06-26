import {User} from '../models/userModel.js';

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

export const login = (req, res) => {
  try {
    if(req.isAuthenticated()){
      return res.status(200).json({user: req.user});
    }
    else{
      return res.status(401).json({error: "Not Authenticated!"});
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
    
  }
}