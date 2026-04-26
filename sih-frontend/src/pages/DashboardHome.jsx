import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, AlertTriangle, Activity, QrCode as QrIcon, 
  TrendingUp, ShieldCheck, BarChart3, BookOpen, Layers 
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const DashboardHome = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data: profile } = await axios.get('http://localhost:5000/api/students/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(profile);

        if (profile.role === 'admin') {
          const { data: adminData } = await axios.get('http://localhost:5000/api/students/high-risk', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats({
            total: adminData.length,
            highRisk: adminData.filter(s => s.riskScore > 50).length,
            avgAtt: adminData.length > 0 
              ? (adminData.reduce((acc, s) => acc + s.attendancePercentage, 0) / adminData.length).toFixed(1)
              : 0
          });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading || !user) return <div className="p-10 text-slate-500 text-center animate-pulse">HUB INITIALIZING...</div>;

  // --- ADMIN VIEW ---
  if (user.role === 'admin') {
    return (
      <div className="animate-in fade-in duration-500">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-white">Command Center</h1>
          <p className="text-slate-400 mt-2">Institutional Overview: <span className="text-emerald-400 font-bold uppercase text-xs tracking-widest border border-emerald-500/20 px-2 py-1 rounded-md bg-emerald-500/5 ml-2">Root Access</span></p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Students" value={stats?.total || 0} icon={<Users size={22}/>} trend="Database Active" />
          <StatCard title="Avg. Attendance" value={`${stats?.avgAtt || 0}%`} icon={<Activity size={22}/>} trend="Campus Flow" />
          <StatCard title="Risk Thresholds" value={stats?.highRisk || 0} icon={<AlertTriangle size={22}/>} isRisk trend="Immediate Action" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0f172a] border border-white/5 p-8 rounded-[40px] shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2"><BarChart3 className="text-emerald-400"/> Branch Analytics</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{n:'IT', r:12}, {n:'CS', r:18}, {n:'ME', r:8}, {n:'CE', r:5}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="n" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Bar dataKey="r" fill="#10b981" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[40px] shadow-2xl flex flex-col justify-center items-center text-center">
            <QrIcon className="text-white mb-6 opacity-30" size={80} />
            <h3 className="text-2xl font-bold text-white mb-3">Launch Session</h3>
            <button onClick={() => window.location.href = '/dashboard/generate-qr'} className="w-full py-4 bg-white text-indigo-700 font-black rounded-2xl hover:scale-105 transition-all">GENERATE QR</button>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDENT VIEW ---
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-white">System, <span className="text-emerald-500 uppercase">{user.name.split(' ')[0]}</span></h1>
        <p className="text-slate-400 mt-2">Connection Status: <span className="text-emerald-400 font-bold uppercase text-xs">Secure & Syncing</span></p>
      </header>

      {/* Row 1: Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Attendance" value={`${user.attendancePercentage?.toFixed(1)}%`} icon={<Activity size={22}/>} trend="Real-time Log" />
        <StatCard title="Academic CGPA" value={user.cgpa || "0.0"} icon={<ShieldCheck size={22}/>} trend="Current Stand" />
        <StatCard title="Dropout Risk" value={`${user.riskScore}%`} icon={<AlertTriangle size={22}/>} isRisk trend="ML Predicted" />
      </div>

      {/* Row 2: Secondary Academic Metrics (The New Stuff!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#0f172a] border border-white/5 p-6 rounded-[32px] flex items-center gap-6 shadow-xl">
            <div className={`p-4 rounded-2xl ${user.backlogs > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                <Layers size={28} />
            </div>
            <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Backlogs</p>
                <h3 className="text-2xl font-black text-white">{user.backlogs || 0} <span className="text-sm text-slate-600 font-normal">Subjects</span></h3>
            </div>
        </div>

        <div className="bg-[#0f172a] border border-white/5 p-6 rounded-[32px] flex items-center gap-6 shadow-xl">
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                <BookOpen size={28} />
            </div>
            <div className="flex-grow">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Assignments Completed</p>
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-2xl font-black text-white">{user.assignmentsCompleted} / {user.totalAssignments}</h3>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg">
                        {user.totalAssignments > 0 ? Math.round((user.assignmentsCompleted / user.totalAssignments) * 100) : 0}%
                    </span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                        className="bg-indigo-500 h-full transition-all duration-1000" 
                        style={{ width: `${(user.assignmentsCompleted / user.totalAssignments) * 100}%` }}
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0f172a] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2"><TrendingUp className="text-emerald-400"/> Retention Analytics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{n:'M', r:10}, {n:'T', r:15}, {n:'W', r:12}, {n:'T', r:18}, {n:'F', r:user.riskScore}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="n" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Area type="monotone" dataKey="r" stroke="#10b981" fillOpacity={0.1} fill="#10b981" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-10 rounded-[40px] shadow-2xl flex flex-col justify-center items-center text-center">
          <QrIcon size={80} className="text-white mb-6 opacity-20" />
          <h3 className="text-2xl font-bold text-white mb-3">Sync Attendance</h3>
          <button onClick={() => window.location.href = '/dashboard/mark-attendance'} className="bg-white text-emerald-700 font-black px-8 py-4 rounded-2xl w-full hover:scale-105 transition-all">SCAN QR</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;