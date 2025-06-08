import {User} from '../models/userModel.js';

// Example controller for local registration
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Create new user with password for local auth
    const user = await User.create({
      name,
      email,
      password // This will be hashed by the pre-save hook
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
    const { email, password } = req.user || req.body;

    
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email and password are required'
      });
    }
    // Find user by credentials
    const user = await User.findOne({email});
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if(password){
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }
    }
    
    // Generate tokens
    const token = user.generateAuthToken();
    const loggedUser = await User.findById(user._id).select('-password');

    const options = {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
    }

    res.status(200)
    .cookie('token', token, options)
    .json({
      message: 'Login successful',
      status: 'success',  
      token,
      user: loggedUser
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}