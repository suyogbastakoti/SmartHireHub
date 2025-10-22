const express = require('express');
const router = express.Router();

const { authenticateToken, requireEmployer, requireEmployerOrAdmin } = require('../middleware/authMiddleware');
const { validate, jobPostingSchema, jobUpdateSchema } = require('../middleware/validation');
const jobController = require('../controllers/jobController');

// Public
router.get('/', jobController.getApprovedJobs);
router.get('/:id', jobController.getJobById);

// Employer
router.post('/', authenticateToken, requireEmployer, validate(jobPostingSchema), jobController.createJob);
router.get('/employer/me', authenticateToken, requireEmployer, jobController.getEmployerJobs);

// Update/Delete (Employer or Admin)
router.put('/:id', authenticateToken, requireEmployerOrAdmin, validate(jobUpdateSchema), jobController.updateJob);
router.delete('/:id', authenticateToken, requireEmployerOrAdmin, jobController.deleteJob);

module.exports = router;
