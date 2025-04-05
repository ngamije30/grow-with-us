'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  BellIcon,
  XMarkIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Mock notifications data for demonstration
const mockNotifications = [
  {
    id: 1,
    type: 'job',
    title: 'New job matching your skills',
    message: 'Senior Frontend Developer position at Tech Solutions Inc',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'application',
    title: 'Application status updated',
    message: 'Your application for Product Manager at Startup Hub has been reviewed',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'skill',
    title: 'Course completion',
    message: 'Congratulations! You've completed the React Advanced course',
    time: '1 day ago',
    read: true,
  },
  {
    id: 4,
    type: 'mentor',
    title: 'New message from mentor',
    message: 'Dr. Sarah Johnson sent you a message about your career goals',
    time: '2 days ago',
    read: true,
  },
];

const notificationIcons = {
  job: BriefcaseIcon,
  application: CheckCircleIcon,
  skill: AcademicCapIcon,
  mentor: ChatBubbleLeftIcon,
};

const notificationColors = {
  job: 'text-blue-600',
  application: 'text-green-600',
  skill: 'text-purple-600',
  mentor: 'text-orange-600',
};

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h3 className="font-medium text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
              <button
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type as keyof typeof notificationIcons];
                  const color = notificationColors[notification.type as keyof typeof notificationColors];
                  return (
                    <li
                      key={notification.id}
                      className={`group flex items-start gap-3 p-4 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className={`mt-1 ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <button
                            className="ml-2 rounded-full p-1 text-gray-400 opacity-0 hover:bg-gray-100 group-hover:opacity-100"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 