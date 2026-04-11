import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellDot, X } from 'lucide-react';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem('token'); // Standardized to 'token'
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) { console.error("Failed to fetch notifications:", error); }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notification) => {
    setIsOpen(false);
    if (!notification.isRead) {
      try {
        await fetch(`http://localhost:5000/api/notifications/${notification._id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setNotifications(notifications.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
      } catch (error) { console.error("Failed to mark as read:", error); }
    }
    if (notification.link) { navigate(notification.link); }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-full transition-colors hover:bg-slate-800 text-slate-400 hover:text-white"
      >
        {unreadCount > 0 ? <BellDot className="h-6 w-6 text-emerald-400" /> : <Bell className="h-6 w-6" />}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-[#0f172a]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 flex justify-between items-center border-b border-slate-700/50">
            <h3 className="font-bold text-slate-100">Notifications</h3>
            <button onClick={() => setIsOpen(false)}><X size={16} className="text-slate-500 hover:text-white"/></button>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div 
                  key={notif._id} 
                  onClick={() => handleNotificationClick(notif)} 
                  className={`p-4 border-b border-slate-700/30 hover:bg-slate-700/40 cursor-pointer transition-colors ${!notif.isRead ? 'bg-emerald-500/5' : ''}`}
                >
                  <p className={`text-sm ${!notif.isRead ? 'text-slate-100' : 'text-slate-400'}`}>{notif.message}</p>
                  <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tight">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className="p-10 text-center">
                <Bell className="h-10 w-10 text-slate-700 mx-auto mb-3 opacity-20" />
                <p className="text-sm text-slate-500">All caught up!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default NotificationBell;