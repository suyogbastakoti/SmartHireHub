const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { 
    validate, 
    registerSchema, 
    loginSchema, 
    updateProfileSchema, 
    changePasswordSchema 
} = require('../middleware/validation');

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validate(updateProfileSchema), updateProfile);
router.put('/change-password', authenticateToken, validate(changePasswordSchema), changePassword);

module.exports = router;
