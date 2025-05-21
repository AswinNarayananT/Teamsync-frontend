class PresenceSocketManager {
  constructor(currentUserId, workspaceId, onStatusUpdate) {
    this.socket = null;
    this.currentUserId = currentUserId;
    this.workspaceId = workspaceId;
    this.onStatusUpdate = onStatusUpdate;

    this.pendingChecks = new Map();
  }

  connect() {
    if (this.socket) return;

    this.socket = new WebSocket(`ws://127.0.0.1:8000/ws/online/${this.workspaceId}/`);

    this.socket.onopen = () => {
      console.log("✅ Presence WebSocket connected");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type, user_id, status } = data;

      if (type === "presence" || type === "presence_check") {
        const isOnline = status === "online";

        // Global UI update
        if (this.onStatusUpdate) {
          this.onStatusUpdate(user_id, isOnline);
        }

        // Callback for check_user
        if (type === "presence_check" && this.pendingChecks.has(user_id)) {
          this.pendingChecks.get(user_id)(isOnline);
          this.pendingChecks.delete(user_id);
        }
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

  /**
   * Send a check for a specific user’s online status.
   * Will trigger `onStatusUpdate` AND call optional callback.
   */
  checkUserOnline(userId, callback) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("Presence socket not connected.");
      return;
    }

    if (callback) {
      this.pendingChecks.set(userId, callback);
    }

    this.socket.send(
      JSON.stringify({
        type: "check_user",
        user_id: userId,
      })
    );
  }
}

export default PresenceSocketManager;
