import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from '../components/Chatbot';

const DashboardLayout = () => {
  return (
    <div className="flex bg-[#020617] min-h-screen font-sans selection:bg-emerald-500/30">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* This renders the actual page content */}
          <Outlet />
        </main>
      </div>

      {/* Global AI Assistant */}
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;