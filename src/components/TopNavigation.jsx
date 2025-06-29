import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/auth/authThunks";
import { useNavigate, Link } from "react-router-dom";
import DashboardTitle from "./DashboardTitle";
import { FiLogOut } from "react-icons/fi";
import NotificationBell from "./realtime/NotificationBell";
import { connectVideoSocket, onIncomingCall, markMissedCall } from "../utils/videoCallSocket";
import ZegoVideoCallModal from "./realtime/ZegoVideoCallModal";

const TopNavigation = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const [incomingCall, setIncomingCall] = useState(null);
  const [roomID, setRoomID] = useState(null);


  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

useEffect(() => {
  if (!user?.id) return;

  connectVideoSocket(user.id);

  onIncomingCall((data) => {
    if (data.from_user_id === user.id) return;
    setIncomingCall(data);
  });

  return () => {
    setIncomingCall(null);
    setRoomID(null);
  };
}, [user]);


const handleAccept = async () => {
  if (window.zegoInstance && typeof window.zegoInstance.destroy === 'function') {
    await window.zegoInstance.destroy();
    window.zegoInstance = null;
  }
  
  if (incomingCall?.room_id) {
    setRoomID(incomingCall.room_id);
  }

  setIncomingCall(null);
};



const handleDecline = () => {
  if (incomingCall?.from_user_id) {
    markMissedCall(incomingCall.from_user_id);
  }
  setIncomingCall(null);
  setRoomID(null);
};

  const handleEndCall = () => setRoomID(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-16 bg-[#121214] border-b border-[#2a2a2d] flex justify-between items-center px-4 sm:px-6 shadow-md">
      <DashboardTitle role={role} />

      <div className="flex items-center space-x-2 sm:space-x-4">

        <div className="hidden sm:inline-block p-2 text-gray-300 hover:text-white hover:bg-[#2a2a2d] rounded-full transition-colors duration-200">
          <NotificationBell />
        </div>


      {!user?.is_superuser && (
  <button
    onClick={() => navigate("settings")}
    className="hidden sm:inline-block p-2 text-gray-300 hover:text-white hover:bg-[#2a2a2d] rounded-full transition-colors duration-200"
    aria-label="Profile Settings"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  </button>
)}



        <div className="hidden sm:block h-8 w-px bg-[#2a2a2d]" />

        {user && (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-[#1d1d20] transition-colors duration-200"
              aria-haspopup="true"
              aria-expanded={showUserMenu}
            >
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={`${user.first_name} profile`}
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-inner">
                  {user.first_name ? user.first_name.charAt(0).toUpperCase() : "U"}
                </div>
              )}

              <div className="text-white hidden sm:block">
                <p className="text-sm font-medium">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-400 truncate max-w-[120px]">{user.email}</p>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1d1d20] border border-[#2a2a2d] rounded-md shadow-lg z-10">
                <div className="py-1">
                  <Link
                    to="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2d] hover:text-white"
                  >
                    Profile Settings
                  </Link>
                </div>

                <div className="py-1 border-t border-[#2a2a2d]">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2a2a2d] hover:text-red-300"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1d1d20] hover:bg-[#2a2a2d] text-gray-300 hover:text-red-400 rounded-full border border-gray-700 shadow transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
          aria-label="Logout"
        >
          <FiLogOut className="w-4 h-4" />
        </button>
      </div>

      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl text-center">
            <h3 className="text-lg font-bold mb-2">Incoming call from {incomingCall.from_user_name}</h3>
            <div className="flex justify-center space-x-4">
              <button onClick={handleDecline} className="bg-red-500 text-white px-4 py-2 rounded">
                Decline
              </button>
              <button onClick={handleAccept} className="bg-green-500 text-white px-4 py-2 rounded">
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {roomID && (
        <ZegoVideoCallModal
          userID={user?.id?.toString()}
          userName={user?.first_name}
          roomID={roomID}
          onClose={handleEndCall}
        />
      )}
    </div>
  );
};

export default TopNavigation;
