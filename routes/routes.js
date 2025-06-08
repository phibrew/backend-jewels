import { Router } from 'express';
import passport from 'passport';
import { getProductByID, getAllProducts,
 createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';
import upload from '../middlewares/multer.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import {register, login} from '../controllers/authController.js';

const router = Router();

router.get('/user/register', register);
router.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'], 
      accessType: 'offline', prompt: 'consent'
     }));
router.get('/auth/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login/failed',
        successRedirect: '/login/success',}),
    (req, res) => {
        res.redirect('/dashboard');
    }
)
// router.get('/login/success', (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       message: 'Login successful',
//       user: req.user,
//     });
//   } else {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// });

router.get('/login/success', login);

router.get('/login/failed', (req, res) => {
  res.status(401).json({ message: 'Login failed' });
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

//product routes
router.post('/products', protect, restrictTo('admin'), upload.array('image', 5) ,createProduct); // Create a new product
router.get('/products/:id', getProductByID); // Get a product by ID
router.get('/products', getAllProducts); // Get all products
router.put('/products/:id',protect, restrictTo('admin'), updateProduct); // Update a product by ID
router.delete('/products/:id',protect, restrictTo('admin'), deleteProduct); // Delete a product by ID
export default router;