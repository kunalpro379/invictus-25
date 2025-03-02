import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './header';
import { useAuth } from '@/contexts/AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
