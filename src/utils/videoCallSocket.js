let socket = null;
let onIncomingCallCallback = null;

export const connectVideoSocket = (currentUserId) => {
  if (!currentUserId) {
    console.warn("Video socket: Missing current user ID.");
    return;
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log(`[Video Socket] Already connected as user ${currentUserId}`);
    return;
  }

  socket = new WebSocket('ws://127.0.0.1:8000/ws/video-call/');

  socket.onopen = () => {
    console.log(`[Video Socket] Connected as user ${currentUserId}`);
  };

  socket.onerror = (error) => {
    console.error("[Video Socket] Error:", error);
  };

  socket.onclose = (event) => {
    console.log("[Video Socket] Disconnected.", event.reason);
    socket = null; 
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("[Video Socket] Message received:", data);

      if (data.action === 'incoming_call' && typeof onIncomingCallCallback === 'function') {
        onIncomingCallCallback(data);
      }
    } catch (e) {
      console.error("[Video Socket] Failed to parse message:", e);
    }
  };
};

  export const callUser = (fromUserId, toUserId) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("[Video Socket] Cannot call user, socket not connected.");
      return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const roomID = `${fromUserId}_${toUserId}_${timestamp}`;


    socket.send(JSON.stringify({
      action: 'call_user',
      to_user_id: toUserId,
      room_id: roomID,
    }));

    return roomID;
  };

export const onIncomingCall = (callback) => {
  if (typeof callback === 'function') {
    onIncomingCallCallback = callback;
  } else {
    console.warn("[Video Socket] onIncomingCall expects a function.");
  }
};

export const markMissedCall = (toUserId) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({
    action: 'missed_call',
    to_user_id: toUserId,
  }));
};
