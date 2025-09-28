const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user still exists and is active
        const user = await User.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Add user info to request
        req.user = {
            userId: user._id,
            role: user.role,
            email: user.email
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Check if user has specific role
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

// Check if user is admin
const requireAdmin = authorizeRole('admin');

// Check if user is employer
const requireEmployer = authorizeRole('employer');

// Check if user is job seeker
const requireJobSeeker = authorizeRole('jobseeker');

// Check if user is employer or admin
const requireEmployerOrAdmin = authorizeRole('employer', 'admin');

module.exports = {
    authenticateToken,
    authorizeRole,
    requireAdmin,
    requireEmployer,
    requireJobSeeker,
    requireEmployerOrAdmin
};
