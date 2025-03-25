import React from 'react';
import { useSelector } from 'react-redux';
import Dashboard from './Dashboard';

const MainDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  return <Dashboard user={user} />;
};

export default MainDashboard;
