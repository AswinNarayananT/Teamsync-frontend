import React, { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const NotificationBell = () => {
  const { currentWorkspace } = useSelector((state) => state.currentWorkspace);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const socketRef = useRef(null);

  // Connect WebSocket
  useEffect(() => {
    if (!currentWorkspace?.id) return;

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/${currentWorkspace.id}/`
    );
    socketRef.current = socket;

    socket.onopen = () => console.log('🔔 Notification WebSocket connected');

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'init') {
        const sorted = [...data.notifications].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sorted);
        setUnreadCount(data.unread_count || 0);
      } else if (data.type === 'new') {
        const newNotif = {
          message: data.message,
          is_read: false,
          created_at: new Date().toISOString(),
        };
        setNotifications((prev) => [newNotif, ...prev]);
        if (!open) setUnreadCount((prev) => prev + 1);
      }
    };

    socket.onclose = () => console.warn('❌ Notification WebSocket disconnected');

    return () => socket.close();
  }, [currentWorkspace?.id]);

  // Outside click detection
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Only mark visible unread as read after short delay when opened
  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      const unreadVisible = notifications.filter((n) => !n.is_read);
      if (unreadVisible.length > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'mark_read' }));
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    }, 1000); // Simulates user having time to "see" it

    return () => clearTimeout(timeout);
  }, [open, notifications]);

  const togglePanel = () => {
    setOpen(!open);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={togglePanel} className="relative text-white text-xl">
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-lg z-50 overflow-y-auto">
          <div className="p-4 font-semibold border-b border-gray-700">Notifications</div>
          <div className="p-4 space-y-2">
            {notifications.length === 0 ? (
              <p className="text-gray-400">No notifications</p>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-md text-sm flex items-start ${
                    n.is_read ? 'bg-gray-800' : 'bg-blue-800/60 border border-blue-500'
                  }`}
                >
                  <FaBell className="mr-2 mt-1 text-gray-400" />
                  <div className="flex flex-col">
                    <p>{n.message}</p>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
