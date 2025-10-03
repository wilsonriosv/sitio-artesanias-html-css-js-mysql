"use client";

import { useEffect } from "react";

export default function NotificationStack({ notifications, onDismiss }) {
  useEffect(() => {
    const timers = notifications.map((notification) =>
      setTimeout(() => {
        onDismiss(notification.id);
      }, notification.duration ?? 3200)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, onDismiss]);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification show">
          <i className="fas fa-check-circle" aria-hidden="true" />
          <span>{notification.message}</span>
        </div>
      ))}
    </div>
  );
}



