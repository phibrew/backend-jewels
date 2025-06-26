import { Router } from 'express';
import passport from 'passport';
import { getProductByID, getAllProducts,
 createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';
import upload from '../middlewares/multer.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import {login} from '../controllers/authController.js';

const router = Router();

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent'
}));

// Handle the callback
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  session: true
}), (req, res) => {
    res.redirect('http://localhost:5173/dashboard');
  }
);

router.get('/login', login)

//product routes
router.post('/products', protect, restrictTo('admin'), upload.array('image', 5) ,createProduct); // Create a new product
router.get('/products/:id', getProductByID); // Get a product by ID
router.get('/products', getAllProducts); // Get all products
router.put('/products/:id',protect, restrictTo('admin'), updateProduct); // Update a product by ID
router.delete('/products/:id',protect, restrictTo('admin'), deleteProduct); // Delete a product by ID
export default router;