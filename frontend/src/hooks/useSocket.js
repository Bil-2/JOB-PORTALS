import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { addNotification, setConnectionStatus } from '../store/slices/notificationSlice';
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice';

export const useSocket = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        dispatch(setConnectionStatus(false));
      }
      return;
    }

    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: {
        userId: user._id,
        role: user.role,
      },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      dispatch(setConnectionStatus(true));
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      dispatch(setConnectionStatus(false));
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      dispatch(setConnectionStatus(false));
    });

    // Notification events
    socket.on('notification', (notification) => {
      dispatch(addNotification(notification));
    });

    socket.on('job_application', (data) => {
      if (user.role === 'Employer') {
        dispatch(addNotification({
          type: 'job_application',
          title: 'New Job Application',
          message: `${data.applicantName} applied for ${data.jobTitle}`,
          data: data,
        }));
      }
    });

    socket.on('application_status_update', (data) => {
      if (user.role === 'Job Seeker') {
        dispatch(addNotification({
          type: 'application_update',
          title: 'Application Status Updated',
          message: `Your application for ${data.jobTitle} has been ${data.status}`,
          data: data,
        }));
      }
    });

    socket.on('new_job_match', (data) => {
      if (user.role === 'Job Seeker') {
        dispatch(addNotification({
          type: 'job_match',
          title: 'New Job Match',
          message: `A new job matching your preferences: ${data.jobTitle}`,
          data: data,
        }));
      }
    });

    socket.on('interview_scheduled', (data) => {
      dispatch(addNotification({
        type: 'interview',
        title: 'Interview Scheduled',
        message: `Interview scheduled for ${data.jobTitle} on ${new Date(data.date).toLocaleDateString()}`,
        data: data,
      }));
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        dispatch(setConnectionStatus(false));
      }
    };
  }, [isAuthenticated, user, dispatch]);

  const emitEvent = (event, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    socket: socketRef.current,
    emitEvent,
    isConnected: socketRef.current?.connected || false,
  };
};
