import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const ZegoVideoCallModal = ({ userID, userName, roomID, onClose }) => {
  const containerRef = useRef(null);
  const zpInstanceRef = useRef(null);
  const joinedRef = useRef(false); // Track if we've joined already

  useEffect(() => {
    const appID = parseInt(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

    // Validation check
    if (!userID || !userName || !roomID || !appID || !serverSecret) {
      console.warn("Missing required video call data or credentials", {
        userID, userName, roomID, appID, serverSecret,
      });
      onClose?.(); 
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpInstanceRef.current = zp;
    window.zegoInstance = zp; 

    const joinTimeout = setTimeout(() => {
      if (!joinedRef.current && containerRef.current) {
        joinedRef.current = true;
        try {
          zp.joinRoom({
            container: containerRef.current,
            sharedLinks: [],
            scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
            showScreenSharingButton: true,
            showTextChat: true,
            showPreJoinView: false,
            onLeaveRoom: () => {
              zpInstanceRef.current = null;
              joinedRef.current = false;
              onClose?.();
            },
            onJoinRoom: () => {
              console.log("✅ Joined room successfully");
            },
            onJoinRoomError: (err) => {
              console.error("❌ Failed to join room:", err);
              alert("Failed to join the video call. Please try again.");
              zpInstanceRef.current = null;
              joinedRef.current = false;
              onClose?.();
            },
          });
        } catch (error) {
          console.error("Unexpected error while joining room:", error);
          onClose?.();
        }
      }
    }, 300);

    return () => {
      clearTimeout(joinTimeout);
      const cleanup = async () => {
        try {
          if (zpInstanceRef.current) {
            await zpInstanceRef.current.destroy();
            zpInstanceRef.current = null;
          }
          joinedRef.current = false;
        } catch (err) {
          console.error("Cleanup error:", err);
        }
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
      cleanup();
    };
  }, [roomID, userID, userName, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div ref={containerRef} className="w-full h-[90vh] bg-white rounded-lg overflow-hidden" />
    </div>
  );
};

export default ZegoVideoCallModal;
