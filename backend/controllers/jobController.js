const Job = require('../models/Job');

// Create a new job (Employer only) -> status pending
exports.createJob = async(req, res) =>{
    try{
        const payload = req.body;
        const job = await Job.create({
            title: payload.title,
            description: payload.description,
            companyName: payload.companyName,
            location: payload.location,
            jobType: payload.jobType,
            experienceLevel: payload.experienceLevel,
            salary: payload.salary,
            skillsRequired: payload.skillsRequired,
            requirements: payload.requirements,
            benefits: payload.benefits,
            employer: req.user.userId,
            status:'pending',
            expiryDate: payload.expiryDate
        });
    }
    catch(error){
        console.error(' createJob error: ',error);
        return res.status(500).json({success: false, message:'Failed to create job'});
    }
};

// Public: Get all approved jobs (not expired and active)
exports.getApprovedJobs = async (_req, res) => {
    try{
        const now = new Date();
        const jobs = await Job.find({ status: 'approved', isActive: true, expiryDate: {$gte: now} })
            .sort({ postedDate: -1 });
        return res.status(200).json({ success: true, data: jobs });
    }
    catch (error) {
        console.error('getApprovedJobs error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
    }
};


// Public: Get job by ID (approved only unless owner/admin)
exports.getJobById = async (req, res) => {
    try{
        const job = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const isOwner = req.user && String(job.employer) === String(req.user.userId);
        const isAdmin = req.user && req.user.role === "admin";
        if (job.status !== 'approved' && !isOwner && !isAdmin){
            return res.status(403).json({ success: false, message: 'Job is not available'});
        }

        return res.status(200).json({ success: true, data :job });

    }
    catch(error){
        console.error('getJobById error: ', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch job' });
    }
};





// Employer: Get own jobs (any status)



// Update job (Employer or Admin)


// Delete job (Employer or Admin)

