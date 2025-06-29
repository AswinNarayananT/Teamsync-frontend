import React, { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Notification = () => {
  const { currentWorkspace } = useSelector((state) => state.currentWorkspace);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!currentWorkspace?.id) return;

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/${currentWorkspace.id}/`
    );

    socket.onopen = () => console.log('Notification WebSocket connected');

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'init') {
        const initMessages = data.notifications.map((n) => ({
          message: n.message,
          is_read: n.is_read,
        }));
        setNotifications(initMessages);
        setUnreadCount(data.unread_count || 0);
      }

      else if (data.type === 'new') {
        const newMsg = { message: data.message, is_read: false };
        setNotifications((prev) => [...prev, newMsg]);

        if (!open) {
          setUnreadCount((prev) => prev + 1);
          setOpen(true);  // Auto-open when a new message comes
        }
      }
    };

    socket.onclose = () => {
      console.warn('Notification WebSocket disconnected');
      setTimeout(() => setNotifications([]), 3000);
    };

    return () => socket.close();
  }, [currentWorkspace?.id, open]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = () => {
    const newState = !open;
    setOpen(newState);
    if (newState) {
      setUnreadCount(0); // Reset unread count on open
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={toggleOpen} className="relative text-white text-xl">
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-lg z-50 overflow-y-auto">
          <div className="p-4 font-semibold border-b border-gray-700">
            Notifications
          </div>
          <div className="p-4 space-y-2">
            {notifications.length === 0 ? (
              <p className="text-gray-400">No notifications</p>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-md text-sm flex items-start ${
                    n.is_read ? 'bg-gray-800' : 'bg-gray-700'
                  }`}
                >
                  <FaBell className="mr-2 mt-1 text-gray-400" />
                  <p>{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
