import React, { useState, useEffect } from 'react';
import { Bell, Calendar, User, Tag, AlertCircle } from 'lucide-react';

const getCategoryStyles = (category) => {
  switch (category) {
    case 'Scholarship': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'Exam': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    case 'Event': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notices');
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        setNotices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading) return <div className="p-10 text-slate-500 animate-pulse text-center">Synchronizing bulletin...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-emerald-500/10 rounded-2xl">
          <Bell className="text-emerald-500" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Notice Board</h1>
          <p className="text-slate-400">Latest updates and official announcements from the campus.</p>
        </div>
      </div>
      
      {notices.length === 0 ? (
        <div className="bg-[#0f172a] border border-white/5 p-20 rounded-3xl text-center">
          <AlertCircle size={48} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500 text-lg">No active notices found in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notices.map((notice) => (
            <div key={notice._id} className="group bg-[#0f172a] border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${getCategoryStyles(notice.category)}`}>
                  {notice.category}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors leading-tight">
                {notice.title}
              </h2>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                {notice.content}
              </p>

              <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <User size={14} className="text-emerald-500" />
                  <span>Posted by {notice.author}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Calendar size={14} className="text-emerald-500" />
                  <span>{new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoticeBoard;