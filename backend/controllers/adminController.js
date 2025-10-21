const Job = require('../models/Job');

// Admin: patch job status -> approved | rejected | expired
exports.updateJobStatus = async (req, res) => {
    try{
        const { id } = req.params;
        const { status, rejectedReason } = req.body;

        if (!['approved', 'rejected', 'expired'].includes(status)){
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const job = await Job.findById(id);
        if (!job) return res.status(404).json({success: false, message: 'Job not found'});

        job.status = status;
        if (status === 'approved'){
            job.approvedBy = req.user.userId;
            job.approvedAt = new Date();
            job.rejectedReason = undefined;
        }

        if(status === 'rejected'){
            job.approvedBy = undefined;
            job.approvedAt = new Date();
            job.rejectedReason = undefined;
        }

        await job.save();
        return res.status(200).json({success: true, message: 'Job status updated', data: job});
    }
    catch(error){
        console.error('updateJobStatus error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update job status' });
    }
};