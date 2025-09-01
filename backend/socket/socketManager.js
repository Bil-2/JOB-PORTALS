import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/userSchema.js';

class SocketManager {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.io.use(async (socket, next) => {
      try {
        const { userId, role } = socket.handshake.auth;

        if (!userId) {
          return next(new Error('Authentication error'));
        }

        const user = await User.findById(userId);
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = userId;
        socket.userRole = role;
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.user.name} (${socket.userRole})`);

      // Store connected user
      this.connectedUsers.set(socket.userId, {
        socketId: socket.id,
        user: socket.user,
        role: socket.userRole,
        connectedAt: new Date()
      });

      // Join role-based rooms
      socket.join(socket.userRole);
      socket.join(`user_${socket.userId}`);

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.name}`);
        this.connectedUsers.delete(socket.userId);
      });

      // Handle job application events
      socket.on('job_applied', (data) => {
        this.notifyEmployer(data.employerId, {
          type: 'job_application',
          title: 'New Job Application',
          message: `${data.applicantName} applied for ${data.jobTitle}`,
          data: data
        });
      });

      // Handle application status updates
      socket.on('application_status_updated', (data) => {
        this.notifyUser(data.applicantId, {
          type: 'application_update',
          title: 'Application Status Updated',
          message: `Your application for ${data.jobTitle} has been ${data.status}`,
          data: data
        });
      });

      // Handle interview scheduling
      socket.on('interview_scheduled', (data) => {
        this.notifyUser(data.applicantId, {
          type: 'interview',
          title: 'Interview Scheduled',
          message: `Interview scheduled for ${data.jobTitle} on ${new Date(data.date).toLocaleDateString()}`,
          data: data
        });
      });
    });

    return this.io;
  }

  // Notify specific user
  notifyUser(userId, notification) {
    const userConnection = this.connectedUsers.get(userId);
    if (userConnection) {
      this.io.to(`user_${userId}`).emit('notification', notification);
    }
  }

  // Notify employer about new applications
  notifyEmployer(employerId, notification) {
    this.notifyUser(employerId, notification);
  }

  // Notify job seekers about matching jobs
  notifyJobSeekers(jobData) {
    this.io.to('Job Seeker').emit('new_job_match', jobData);
  }

  // Broadcast to all users of a specific role
  broadcastToRole(role, event, data) {
    this.io.to(role).emit(event, data);
  }

  // Broadcast to all connected users
  broadcast(event, data) {
    this.io.emit(event, data);
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get connected users by role
  getConnectedUsersByRole(role) {
    return Array.from(this.connectedUsers.values()).filter(user => user.role === role);
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }
}

export default new SocketManager();
