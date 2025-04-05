'use client';

import { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';

export default function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Set up polling for new notifications every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  };

  return (
    <button
      type="button"
      className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      <BellIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
} 