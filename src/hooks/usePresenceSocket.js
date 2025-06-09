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

      // Callback for presence status updates
      (user_id, isOnline) => {
        setOnlineStatus((prevStatus) => ({
          ...prevStatus,
          [user_id]: isOnline,
        }));
      },

      // Callback for unread summary and chat message updates
      ({ lastMessages: newLastMessages, unreadCounts: newUnreadCounts }) => {
        console.log("📬 Chat Summary Received:");
        console.log("🕒 Last Messages:", newLastMessages);
        console.log("🔢 Unread Counts:", newUnreadCounts);

        // Only update state if there are actual changes to avoid unnecessary rerenders
        setLastMessages((prev) => {
          const changed = JSON.stringify(prev) !== JSON.stringify(newLastMessages);
          return changed ? newLastMessages : prev;
        });

        setUnreadCounts((prev) => {
          const changed = JSON.stringify(prev) !== JSON.stringify(newUnreadCounts);
          return changed ? newUnreadCounts : prev;
        });
      }
    );

    socketManager.connect();
    socketRef.current = socketManager;

    // Debug connection
    console.log("🔌 PresenceSocketManager connected");

    return () => {
      socketManager.disconnect();
      socketRef.current = null;
      console.log("🔌 PresenceSocketManager disconnected");
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
