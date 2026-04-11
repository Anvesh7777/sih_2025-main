import React from 'react';
import NotificationBell from '../components/NotificationBell';
import { User } from 'lucide-react';

function Header() {
  // We don't need studentName prop anymore, pages will handle greetings
  // but we provide the common UI elements like notifications and profile
  
  return (
    <header className="flex justify-between items-center py-6 px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
      <div>
        {/* Left side can be used for breadcrumbs or page titles if needed */}
        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">System Operational</p>
      </div>
      
      <div className="flex items-center gap-6">
        <NotificationBell />
        
        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
        
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">Active Session</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase">Portal User</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 group-hover:border-emerald-500/50 transition-all">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;