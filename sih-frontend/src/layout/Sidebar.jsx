import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardList, BookOpen, 
  UserCheck, FileText, User, LogOut, GraduationCap,
  ShieldAlert, PlusCircle 
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  let userRole = 'student';
  try {
    if (token) {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    }
  } catch (err) {
    console.error("Token error");
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Standard links for everyone
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/dashboard' },
    { name: 'Notice Board', icon: <ClipboardList size={20}/>, path: '/dashboard/notice-board' },
    { name: 'E-Library', icon: <BookOpen size={20}/>, path: '/dashboard/e-library' },
  ];

  // Links only for Students
  const studentItems = [
    { name: 'My Attendance', icon: <UserCheck size={20}/>, path: '/dashboard/attendance' },
    { name: 'My Results', icon: <FileText size={20}/>, path: '/dashboard/results' },
  ];

  // Links only for Admins
  const adminItems = [
    { name: 'Risk Management', icon: <ShieldAlert size={20}/>, path: '/dashboard/high-risk' },
    { name: 'Add Resource', icon: <PlusCircle size={20}/>, path: '/dashboard/add-resource' },
  ];

  const finalMenu = userRole === 'admin' 
    ? [...menuItems, ...adminItems] 
    : [...menuItems, ...studentItems];

  return (
    <div className="h-screen w-64 bg-[#0f172a] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-emerald-500 shadow-lg shadow-emerald-500/20 p-2 rounded-xl">
          <GraduationCap className="text-white" size={24} />
        </div>
        <h1 className="text-white font-bold text-xl tracking-tight leading-none">
          SIH <span className="text-emerald-500">Hub</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
        {finalMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link 
          to="/dashboard/profile" 
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <User size={20} />
          <span className="font-medium text-sm">My Profile</span>
        </Link>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;