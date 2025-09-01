import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";
import ErrorHandler from "../middlewares/error.js";
import socketManager from '../socket/socketManager.js';

// Dashboard Analytics
export const getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'Admin' && role !== 'Employer') {
    return next(new ErrorHandler("Access denied", 403));
  }

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Basic counts
  const totalUsers = await User.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const activeJobs = await Job.countDocuments({ expired: false });

  // User statistics
  const jobSeekers = await User.countDocuments({ role: 'Job Seeker' });
  const employers = await User.countDocuments({ role: 'Employer' });
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: lastMonth }
  });

  // Job statistics
  const newJobsThisMonth = await Job.countDocuments({
    jobPostedOn: { $gte: lastMonth }
  });
  const newJobsThisWeek = await Job.countDocuments({
    jobPostedOn: { $gte: lastWeek }
  });

  // Application statistics
  const newApplicationsThisMonth = await Application.countDocuments({
    createdAt: { $gte: lastMonth }
  });
  const pendingApplications = await Application.countDocuments({
    status: 'pending'
  });

  // Popular job categories
  const popularCategories = await Job.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Monthly trends
  const monthlyJobTrends = await Job.aggregate([
    {
      $match: {
        jobPostedOn: { $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$jobPostedOn' },
          month: { $month: '$jobPostedOn' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const monthlyApplicationTrends = await Application.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Real-time data
  const connectedUsers = socketManager.getConnectedUsersCount();
  const onlineJobSeekers = socketManager.getConnectedUsersByRole('Job Seeker').length;
  const onlineEmployers = socketManager.getConnectedUsersByRole('Employer').length;

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalJobs,
        totalApplications,
        activeJobs,
        jobSeekers,
        employers,
        newUsersThisMonth,
        newJobsThisMonth,
        newJobsThisWeek,
        newApplicationsThisMonth,
        pendingApplications
      },
      trends: {
        monthlyJobs: monthlyJobTrends,
        monthlyApplications: monthlyApplicationTrends
      },
      categories: popularCategories,
      realTime: {
        connectedUsers,
        onlineJobSeekers,
        onlineEmployers
      }
    }
  });
});

// User Management
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'Admin') {
    return next(new ErrorHandler("Admin access required", 403));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const userRole = req.query.role || '';

  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (userRole) {
    query.role = userRole;
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    success: true,
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// Job Management
export const getAllJobsAdmin = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'Admin') {
    return next(new ErrorHandler("Admin access required", 403));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const category = req.query.category || '';
  const status = req.query.status || '';

  let query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (category) {
    query.category = category;
  }
  if (status === 'active') {
    query.expired = false;
  } else if (status === 'expired') {
    query.expired = true;
  }

  const jobs = await Job.find(query)
    .populate('postedBy', 'name email')
    .sort({ jobPostedOn: -1 })
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalJobs / limit);

  res.status(200).json({
    success: true,
    jobs,
    pagination: {
      currentPage: page,
      totalPages,
      totalJobs,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// Application Management
export const getAllApplicationsAdmin = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'Admin') {
    return next(new ErrorHandler("Admin access required", 403));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const status = req.query.status || '';

  let query = {};
  if (status) {
    query.status = status;
  }

  const applications = await Application.find(query)
    .populate('applicantID.user', 'name email')
    .populate('employerID.user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalApplications = await Application.countDocuments(query);
  const totalPages = Math.ceil(totalApplications / limit);

  res.status(200).json({
    success: true,
    applications,
    pagination: {
      currentPage: page,
      totalPages,
      totalApplications,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// System Health
export const getSystemHealth = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'Admin') {
    return next(new ErrorHandler("Admin access required", 403));
  }

  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  // Database health check
  const dbHealth = {
    users: await User.countDocuments(),
    jobs: await Job.countDocuments(),
    applications: await Application.countDocuments()
  };

  // Socket.io health
  const socketHealth = {
    connected: socketManager.getConnectedUsersCount(),
    jobSeekers: socketManager.getConnectedUsersByRole('Job Seeker').length,
    employers: socketManager.getConnectedUsersByRole('Employer').length
  };

  res.status(200).json({
    success: true,
    system: {
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024)
      },
      database: dbHealth,
      realTime: socketHealth,
      timestamp: new Date().toISOString()
    }
  });
});

// Broadcast System Message
export const broadcastMessage = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'Admin') {
    return next(new ErrorHandler("Admin access required", 403));
  }

  const { message, type = 'info', targetRole } = req.body;

  if (!message) {
    return next(new ErrorHandler("Message is required", 400));
  }

  const notification = {
    type: 'system_message',
    title: 'System Notification',
    message,
    priority: type,
    timestamp: new Date().toISOString()
  };

  if (targetRole) {
    socketManager.broadcastToRole(targetRole, 'notification', notification);
  } else {
    socketManager.broadcast('notification', notification);
  }

  res.status(200).json({
    success: true,
    message: 'Message broadcasted successfully'
  });
});
