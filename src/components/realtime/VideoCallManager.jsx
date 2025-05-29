import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ZegoVideoCallModal from './ZegoVideoCallModal';

const JoinMeetingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [meetingDetails, setMeetingDetails] = useState(null);

  useEffect(() => {
    const roomID = searchParams.get('roomID');
    const userID = searchParams.get('userID');
    const userName = searchParams.get('userName');
    const token = searchParams.get('token');

    if (!roomID || !userID || !userName || !token) {
      navigate('/dashboard');
      return;
    }

    setMeetingDetails({ roomID, userID, userName, token });
  }, [searchParams, navigate]);

  if (!meetingDetails) return null;

  return (
    <ZegoVideoCallModal
      roomID={meetingDetails.roomID}
      userID={meetingDetails.userID}
      userName={meetingDetails.userName}
      token={meetingDetails.token}  
      onClose={() => navigate('/dashboard')}
    />
  );
};

export default JoinMeetingPage;
