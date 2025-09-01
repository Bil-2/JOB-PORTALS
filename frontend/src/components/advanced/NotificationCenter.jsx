import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, X, Check, Trash2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import {
  selectNotifications,
  selectUnreadCount,
  markAsRead,
  removeNotification,
  markAllAsRead,
  clearAllNotifications
} from '../../store/slices/notificationSlice';
import { useSocket } from '../../hooks/useSocket';
import { formatRelativeTime } from '../../lib/utils';

const NotificationCenter = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const { isConnected } = useSocket();

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const handleRemoveNotification = (notificationId) => {
    dispatch(removeNotification(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job_application':
        return '📋';
      case 'application_update':
        return '📝';
      case 'job_match':
        return '🎯';
      case 'interview':
        return '📅';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'job_application':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20';
      case 'application_update':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20';
      case 'job_match':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20';
      case 'interview':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-4 top-20 w-96 max-h-[80vh] z-50"
    >
      <Card className="shadow-lg border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="h-3 w-3 mr-1" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
                <p className="text-sm">You'll see new notifications here</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 border-b border-border ${!notification.read ? getNotificationColor(notification.type) : ''
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatRelativeTime(notification.timestamp)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-6 w-6"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveNotification(notification.id)}
                            className="h-6 w-6"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationCenter;
