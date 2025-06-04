import React, { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import NotificationSnackbar from './NotificationSnackbar';

const NotificationBell = () => {
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const panelRef = useRef(null);
  const socketRef = useRef(null);

useEffect(() => {
  if (socketRef.current) {
    socketRef.current.close();
    socketRef.current = null;
  }

  if (!user) return;

  const delay = setTimeout(() => {
    console.log('✅ Creating new WebSocket for user:', user.email);

    const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    const wsProtocol = apiUrl.startsWith('https://') ? 'wss://' : 'ws://';
    const host = apiUrl.replace(/^https?:\/\//, '');
    const socket = new WebSocket(`${wsProtocol}${host}/ws/notifications/`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('🔔 WebSocket connected');
    };

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
          workspace: data.workspace || null,
        };
        setNotifications((prev) => [newNotif, ...prev]);
        if (!open) setUnreadCount((prev) => prev + 1);
        setSnackbarMessage(`${user?.first_name || 'Someone'}: ${data.message}`);
      }
    };

    socket.onclose = () => {
      console.warn('❌ WebSocket disconnected');
    };
  }, 200);

  return () => {
    clearTimeout(delay);
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };
}, [user]);





  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      const unreadVisible = notifications.filter((n) => !n.is_read);
      if (unreadVisible.length > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'mark_read' }));
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [open, notifications]);

  const togglePanel = () => setOpen(!open);

  const handleSnackbarClose = () => setSnackbarMessage(null);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={togglePanel} 
        className="relative text-white text-xl hover:text-blue-300 transition"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 font-semibold border-b border-gray-700 flex justify-between items-center">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <button 
                className="text-xs text-blue-400 hover:text-blue-300"
                onClick={() => {
                  if (socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ type: 'mark_read' }));
                    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                    setUnreadCount(0);
                  }
                }}
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(96vh - 200px)' }}>
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <FaBell className="mx-auto mb-2 text-2xl opacity-30" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className={`p-3 text-sm flex items-start hover:bg-gray-800/50 transition ${n.is_read ? 'bg-gray-800/20' : 'bg-blue-900/20 border-l-4 border-blue-500'}`}
                  >
                    <FaBell className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{n.message}</p>
                      {n.workspace?.name && (
                        <span className="text-xs text-gray-400 block italic">
                          Workspace: {n.workspace.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 mt-1 block">
                        {formatTimeAgo(n.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {snackbarMessage && (
        <NotificationSnackbar
          message={snackbarMessage}
          onClose={handleSnackbarClose}
        />
      )}
    </div>
  );
};

export default NotificationBell;
