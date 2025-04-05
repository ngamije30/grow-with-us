import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export const NotificationList = () => {
  const { data: notifications, isLoading } = useQuery(
    ['notifications'],
    async () => {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.json();
    }
  );

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="notifications">
      {notifications?.map((notification: any) => (
        <div key={notification.id} className="notification-item">
          <h3>{notification.title}</h3>
          <p>{notification.content}</p>
          <small>{new Date(notification.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};