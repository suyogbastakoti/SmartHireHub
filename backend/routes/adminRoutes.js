const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Admin: update job status
router.patch('/jobs/:id/status', authenticateToken, requireAdmin, adminController.updateJobStatus);

module.exports = router;
