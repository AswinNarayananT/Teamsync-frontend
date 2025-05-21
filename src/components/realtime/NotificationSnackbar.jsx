import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';

const NotificationSnackbar = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {

    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50 pointer-events-none p-4">
      <div 
        className={`flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-lg shadow-lg max-w-md w-full pointer-events-auto
          ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}
          transition-all duration-300 ease-in-out`}
      >
        <div className="flex-shrink-0 mr-3">
          <FaBell className="text-white text-lg" />
        </div>
        <div className="flex-1 mr-2">
          <p className="font-medium text-sm">New Notification</p>
          <p className="text-xs text-white/90">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 ml-2 text-white/70 hover:text-white transition focus:outline-none"
          aria-label="Close notification"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationSnackbar;