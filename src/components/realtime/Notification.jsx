// Notification.jsx
import React, { useEffect, useState } from 'react';
import { FaBell, FaRegBell } from 'react-icons/fa';
import { IconButton } from '@mui/material';
import { MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';

const Notification = () => {
  const { currentWorkspace } = useSelector((state) => state.currentWorkspace);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/${currentWorkspace.id}/`
    );

    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'init') {
        setNotifications(data.notifications.map((n) => n.message));
        console.log(notifications)
      } else if (data.type === 'new') {
        setNotifications((prev) => [...prev, data.message]);
      }
    };
    socket.onclose = () => {
      console.error('WebSocket closed unexpectedly');
      setTimeout(() => setNotifications([]), 3000);
    };

    return () => socket.close();
  }, [currentWorkspace.id]);

  return (
    <>
      {/* Bell Icon */}
      <div className="fixed bottom-5 right-5 z-50">
        <div className="relative">
          <div
            onClick={() => setOpen(true)}
            className="cursor-pointer text-white text-3xl"
          >
            {notifications.length ? <FaRegBell /> : <FaBell />}
          </div>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>
      </div>

      {/* Side panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-gray-900 text-white shadow-xl
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <IconButton
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white"
            size="small"
          >
            <MdClose />
          </IconButton>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto h-full space-y-3">
          {notifications.length === 0 ? (
            <p className="text-gray-400">No new notifications</p>
          ) : (
            notifications.map((msg, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg"
              >
                <FaBell className="mt-1 text-gray-500" />
                <p className="text-sm">{msg}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notification;
