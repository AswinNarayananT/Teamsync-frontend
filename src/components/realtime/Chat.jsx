import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AccountCircle } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { IoSend, IoArrowBack } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import api from '../../api';
import { logoutUser } from '../../redux/auth/authThunks';
import usePresenceSocket from '../../hooks/usePresenceSocket';
import { callUser } from '../../utils/videoCallSocket';
import ZegoVideoCallModal from './ZegoVideoCallModal';

export default function Chat() {
    const dispatch = useDispatch();
  const currentWorkspace = useSelector((state) => state.currentWorkspace.currentWorkspace || {});
  const members = useSelector((state) => state.currentWorkspace.members || []);
  const currentUser = useSelector((state) => state.auth.user);
  


   const { unreadCounts, lastMessages, onlineStatus } = usePresenceSocket(
    currentUser?.id,
    currentWorkspace?.id
  );


  const [localUnreadCounts, setLocalUnreadCounts] = useState({});

  useEffect(() => {
    setLocalUnreadCounts(unreadCounts);
  }, [unreadCounts]);



  const containerRef = useRef(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState({}); 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isValidated, setIsValidated] = useState(null);
  const [roomID, setRoomID] = useState(null);

  const selectedUserStatus = onlineStatus[selectedUser?.user_id];
  const chatMessages = selectedUser ? messages[selectedUser.user_id] || [] : [];

  const filteredMembers = members.filter((m) => m.user_id !== currentUser?.id);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

useEffect(() => {
  if (!currentUser?.id || !selectedUser || !currentWorkspace?.id) return;

  let ws;

  (async () => {
    try {
      await api.get('api/v1/realtime/auth/validate/');
      setIsValidated(true);

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, ''); // Remove trailing slash

      // Determine ws protocol with '://'
      const wsProtocol = apiUrl.startsWith('https://') ? 'wss://' : 'ws://';

      // Remove http(s) protocol from apiUrl to get host + path
      const host = apiUrl.replace(/^https?:\/\//, '');

      // Construct full WebSocket URL
      const chatUrl = `${wsProtocol}${host}/ws/chat/${currentWorkspace.id}/${selectedUser.user_id}/`;

      ws = new WebSocket(chatUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        ws.send(JSON.stringify({ type: 'fetch_history' }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'chat_message') {
          setMessages((prev) => ({
            ...prev,
            [selectedUser.user_id]: [...(prev[selectedUser.user_id] || []), data.message],
          }));

          if (data.message.receiver === currentUser.id) {
            ws.send(JSON.stringify({ type: 'mark_delivered', message_id: data.message.id }));
            ws.send(JSON.stringify({ type: 'mark_read', message_ids: [data.message.id] }));
          }
        } else if (data.type === 'chat_history') {
          setMessages((prev) => ({
            ...prev,
            [selectedUser.user_id]: data.messages,
          }));
        } else if (data.type === 'read_update') {
          const { message_ids } = data;
          setMessages((prev) => {
            const updated = { ...prev };
            const updatedMessages = updated[selectedUser.user_id]?.map((msg) =>
              message_ids.includes(msg.id) ? { ...msg, is_read: true } : msg
            );
            return {
              ...updated,
              [selectedUser.user_id]: updatedMessages,
            };
          });
        }
      };

      ws.onclose = () => console.log('WebSocket disconnected');
      ws.onerror = (error) => console.error('WebSocket error', error);
    } catch (error) {
      dispatch(logoutUser());
      setSelectedUser(null);
      setIsValidated(false);
      if (ws) ws.close();
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }
  })();

  return () => {
    if (ws) ws.close();
  };
}, [selectedUser, currentUser?.id, currentWorkspace?.id, dispatch]);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  useEffect(() => {
    if (!containerRef.current || !socketRef.current || !chatMessages.length) return;

    const ws = socketRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            const msg = chatMessages.find((m) => m.id.toString() === messageId);

            if (msg && msg.receiver === currentUser.id && !msg.is_read) {
              ws.send(JSON.stringify({ type: 'mark_read', message_ids: [msg.id] }));
            }
          }
        });
      },
      { threshold: 1.0 }
    );

    const elements = containerRef.current.querySelectorAll('.chat-message');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [chatMessages, currentUser?.id]);

  useEffect(() => {
    if (selectedUser?.user_id && localUnreadCounts[selectedUser.user_id]) {
      setLocalUnreadCounts((prev) => ({
        ...prev,
        [selectedUser.user_id]: 0,
      }));
    }
  }, [selectedUser]);

  

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socketRef.current) return;

    const newMessage = {
      type: 'chat_message',
      text: messageInput.trim(),
      receiver_id: selectedUser.user_id,
    };

    socketRef.current.send(JSON.stringify(newMessage));
    setMessageInput('');
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData) => {
    setMessageInput((prev) => prev + emojiData.emoji);
  };

  const sortedMembers = filteredMembers.slice().sort((a, b) => {
    const lastA = messages[a.user_id]?.slice(-1)[0];
    const lastB = messages[b.user_id]?.slice(-1)[0];
    return new Date(lastB?.timestamp || 0) - new Date(lastA?.timestamp || 0);
  });

  const handleCall = async () => {
    if (window.zegoInstance && typeof window.zegoInstance.destroy === 'function') {
      await window.zegoInstance.destroy();
      window.zegoInstance = null;
    }
    setRoomID(null);
    const room = callUser(currentUser.id, selectedUser.user_id);
    setRoomID(room);
  };

  const handleEndCall = () => setRoomID(null);

  

  return (
    <div className="flex h-[88vh] bg-[#0b141a] text-white rounded-md shadow-md overflow-hidden relative">
      {(!isMobile || !selectedUser) && (
    <div
      className={`${
        isMobile ? 'w-full' : 'w-1/4'
      } bg-[#1f2c34] border-r border-[#2a3942] flex flex-col`}
    >
      <div className="p-4 text-xl font-semibold border-b border-[#2a3942]">
        Chats
      </div>

          <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#2a3942]">
      {sortedMembers.map((member) => {
        const lastMsg = lastMessages.find(
          (msg) => msg.user_id === member.user_id
        );
        const lastText = lastMsg?.message || "No messages yet";

        const unreadCount = localUnreadCounts[member.user_id] || 0;

        const isOnline = onlineStatus[member.user_id] === true;

        return (
          <div
            key={member.user_id}
            onClick={() => setSelectedUser(member)}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#2a3942] border-b border-[#2a3942] ${
              selectedUser?.user_id === member.user_id ? "bg-[#2a3942]" : ""
            }`}
          >
            <div className="relative">
              {member.user_profile_picture ? (
                <img
                  src={member.user_profile_picture}
                  alt={member.user_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <AccountCircle className="text-gray-500" fontSize="large" />
                </div>
              )}

              {isOnline && (
                <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-[#1f2c34] rounded-full" />
              )}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="font-medium truncate flex items-center justify-between">
                <span>{member.user_name}</span>
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 truncate">{lastText}</div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  )}
{/* Chat area */}
{(!isMobile || selectedUser) && selectedUser && (
  <div className={`${isMobile ? 'w-full' : 'w-3/4'} flex flex-col relative`}>
    <div className="flex items-center justify-between p-2.5 bg-[#1f2c34] border-b border-[#2a3942]">
      <div className="flex items-center gap-4">
        {isMobile && (
          <IconButton onClick={() => setSelectedUser(null)} className="text-white">
            <IoArrowBack size={22} />
          </IconButton>
        )}

        {selectedUser.user_profile_picture ? (
          <img
            src={selectedUser.user_profile_picture}
            alt={selectedUser.user_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <AccountCircle className="text-gray-400" fontSize="large" />
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{selectedUser.user_name}</span>
            <span className={`h-2 w-2 rounded-full ${selectedUserStatus ? 'bg-green-500' : 'bg-gray-500'}`} />
          </div>
          <div className="text-xs text-gray-400">{selectedUser.role}</div>
        </div>
      </div>

      <button
        onClick={handleCall}
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md shadow-sm transition-all duration-150"
        title="Start call"
      >
        📞 Call
      </button>
    </div>

    <div ref={containerRef} className="flex-1 flex flex-col bg-[#121b22] overflow-y-auto px-4 py-3">
      {chatMessages.length === 0 ? (
        <div className="flex items-center justify-center text-gray-400">
          No messages yet. Start the conversation.
        </div>
      ) : (
        chatMessages.map((msg, idx) => (
          <div
            key={idx}
            data-message-id={msg.id}
            className={`flex mb-2 chat-message ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 max-w-xs md:max-w-md rounded-lg text-sm break-words relative ${
                msg.sender === currentUser.id
                  ? 'bg-green-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-white rounded-bl-none'
              }`}
            >
              <div>{msg.text}</div>
              <div className="text-[10px] text-gray-300 mt-1 text-right select-none">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                {msg.sender === currentUser.id &&
                  (msg.is_read ? '✓✓' : msg.is_delivered ? '✓' : '')}
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>

    {showEmojiPicker && (
      <div className="absolute bottom-16 left-2 z-10" ref={emojiPickerRef}>
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          theme="dark"
          emojiStyle="twitter"
          height={350}
          width={isMobile ? 280 : 320}
        />
      </div>
    )}

    <div className="flex items-center px-2 py-2 bg-[#1f2c34] border-t border-[#2a3942]">
      <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)} className="text-gray-400">
        <span role="img" aria-label="emoji" className="text-yellow-400 text-xl">
          😊
        </span>
      </IconButton>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type a message"
        className="flex-1 px-3 py-2 mx-2 rounded-full bg-[#2a3942] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600"
      />
      <IconButton onClick={handleSendMessage} className="text-green-500" disabled={!messageInput.trim()}>
        <IoSend size={22} />
      </IconButton>
    </div>
  </div>
)}

      {roomID && (
        <ZegoVideoCallModal
          userID={currentUser?.id?.toString()}
          userName={currentUser?.first_name}
          roomID={roomID}
          onClose={handleEndCall}
        />
      )}
    </div>
  );
}