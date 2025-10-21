const cron = require('node-cron');
const Job = require('../models/Job');
const Subscription = require('../models/Subscription');

// runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily expiry check...');
  const now = new Date();
  
  // expire jobs
  await Job.updateMany({ expiryDate: { $lt: now } }, { status: 'expired' });

  // expire subscriptions
  await Subscription.updateMany({ endDate: { $lt: now } }, { paymentStatus: 'expired' });

  console.log('Expired jobs and subscriptions updated.');
});


