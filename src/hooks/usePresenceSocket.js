import { useEffect, useRef, useState } from "react";
import PresenceSocketManager from "../utils/PresenceSocketManager";

const usePresenceSocket = (userId, workspaceId) => {
  const socketRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({});

  useEffect(() => {
    if (!userId || !workspaceId) return;

    const socketManager = new PresenceSocketManager(
      userId,
      workspaceId,

      (user_id, isOnline) => {
        setOnlineStatus((prevStatus) => ({
          ...prevStatus,
          [user_id]: isOnline,
        }));
      },

      ({ lastMessages, unreadCounts }) => {
        console.log("📬 Chat Summary Received:");
        console.log("🕒 Last Messages:", lastMessages);
        console.log("🔢 Unread Counts:", unreadCounts);

        setLastMessages(lastMessages);
        setUnreadCounts(unreadCounts);
      }
    );

    socketManager.connect();
    socketRef.current = socketManager;

    return () => {
      socketManager.disconnect();
      socketRef.current = null;
    };
  }, [userId, workspaceId]);

  return {
    unreadCounts,
    lastMessages,
    onlineStatus,
    socket: socketRef.current, 
  };
};

export default usePresenceSocket;
