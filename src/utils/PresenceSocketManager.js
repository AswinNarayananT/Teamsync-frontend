class PresenceSocketManager {
  constructor(currentUserId, workspaceId, onStatusUpdate, onChatSummaryUpdate) {
    this.socket = null;
    this.currentUserId = currentUserId;
    this.workspaceId = workspaceId;

    this.onStatusUpdate = onStatusUpdate;            
    this.onChatSummaryUpdate = onChatSummaryUpdate;

    this.pendingChecks = new Map();
  }

  connect() {
    if (this.socket) return;

    this.socket = new WebSocket(`ws://127.0.0.1:8000/ws/online/${this.workspaceId}/`);

    this.socket.onopen = () => {
      console.log("✅ Presence WebSocket connected");

      // Get initial unread count and last message for all chats
      this.sendMessage({ type: "get_unread_summary" });
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type } = data;

      // Handle presence status updates
      if (type === "presence" || type === "presence_check") {
        const { user_id, status } = data;
        const isOnline = status === "online";

        if (this.onStatusUpdate) {
          this.onStatusUpdate(user_id, isOnline);
        }

        if (type === "presence_check" && this.pendingChecks.has(user_id)) {
          this.pendingChecks.get(user_id)(isOnline);
          this.pendingChecks.delete(user_id);
        }
      }

      // Handle unread count and last message summary updates
      if ((type === "unread_summary" || type === "chat_message_update") && this.onChatSummaryUpdate) {
        const summary = data.data || [];

        const unreadCounts = {};
        const lastMessages = [];

        for (const item of summary) {
          lastMessages.push(item);
          unreadCounts[item.user_id] = item.unread_count;
        }

        this.onChatSummaryUpdate({
          lastMessages,
          unreadCounts,
        });
      }
    };

    this.socket.onclose = () => {
      console.log("⚠️ Presence WebSocket disconnected");
      this.socket = null;
    };

    this.socket.onerror = (error) => {
      console.error("❌ Presence WebSocket error:", error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  checkUserOnline(userId, callback) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("Presence socket not connected.");
      return;
    }

    if (callback) {
      this.pendingChecks.set(userId, callback);
    }

    this.sendMessage({
      type: "check_user",
      user_id: userId,
    });
  }

  /**
   * Triggered when user reads messages in a chat
   * This will notify the backend to update unread count and last message
   */
  markMessagesAsRead(senderId) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("Presence socket not connected.");
      return;
    }

    this.sendMessage({
      type: "mark_read",
      sender_id: senderId,
    });
  }

  sendMessage(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn("⚠️ Socket not ready. Message not sent:", data);
    }
  }
}

export default PresenceSocketManager;
