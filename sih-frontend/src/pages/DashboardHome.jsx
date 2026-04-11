import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  AlertTriangle, 
  Activity, 
  QrCode as QrIcon, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3 
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const DashboardHome = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null); // Institutional data for Admin
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 1. Fetch the user's profile to determine role
        const { data: profile } = await axios.get('http://localhost:5000/api/students/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(profile);

        // 2. If Admin, fetch aggregate institutional data
        if (profile.role === 'admin') {
          const { data: adminData } = await axios.get('http://localhost:5000/api/students/high-risk', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Calculate high-level stats for the Admin view
          setStats({
            total: adminData.length,
            highRisk: adminData.filter(s => s.riskScore > 50).length,
            avgAtt: adminData.length > 0 
              ? (adminData.reduce((acc, s) => acc + s.attendancePercentage, 0) / adminData.length).toFixed(1)
              : 0
          });
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !user) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  // --- ADMIN VIEW (COMMAND CENTER) ---
  if (user.role === 'admin') {
    return (
      <div className="animate-in fade-in duration-500">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Institutional Hub</h1>
          <p className="text-slate-400 mt-2">
            System Status: <span className="text-emerald-400 font-bold uppercase text-sm tracking-widest border border-emerald-500/20 px-2 py-1 rounded-md bg-emerald-500/5 ml-2">Administrator Authorized</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Enrollment" 
            value={stats?.total || 0} 
            icon={<Users size={24}/>} 
            trend="Live Student Database" 
          />
          <StatCard 
            title="Campus Attendance" 
            value={`${stats?.avgAtt || 0}%`} 
            icon={<Activity size={24}/>} 
            trend="Institutional Average" 
          />
          <StatCard 
            title="Critical Risk Alerts" 
            value={stats?.highRisk || 0} 
            icon={<AlertTriangle size={24}/>} 
            isRisk 
            trend="Intervention Required" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Branch-wise Risk Analysis */}
          <div className="lg:col-span-2 bg-[#0f172a] border border-white/5 p-8 rounded-[40px] shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <BarChart3 className="text-emerald-400"/> Branch Risk Distribution
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{name: 'IT', risk: 12}, {name: 'CS', risk: 18}, {name: 'ME', risk: 8}, {name: 'CE', risk: 5}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}} 
                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px'}} 
                  />
                  <Bar dataKey="risk" fill="#10b981" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[40px] shadow-2xl flex flex-col justify-center items-center text-center">
            <QrIcon className="text-white mb-6 opacity-40" size={80} />
            <h3 className="text-2xl font-bold text-white mb-3">Live Session</h3>
            <p className="text-indigo-100 mb-8 text-sm leading-relaxed">
              Initialize an encrypted QR session for real-time classroom attendance.
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard/generate-qr'}
              className="w-full py-4 bg-white text-indigo-700 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl active:scale-95"
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDENT VIEW (PERSONAL PROGRESS) ---
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Welcome back, <span className="text-emerald-500">{user.name.split(' ')[0]}</span>!
        </h1>
        <p className="text-slate-400 mt-2">
          Academic Status: <span className="text-emerald-400 font-bold uppercase text-sm">Active & Monitored</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Overall Attendance" 
          value={`${user.attendancePercentage?.toFixed(1)}%`} 
          icon={<Users size={24}/>} 
          trend="Live Tracking" 
        />
        <StatCard 
          title="Academic CGPA" 
          value={user.cgpa || "0.0"} 
          icon={<ShieldCheck size={24}/>} 
          trend="Current Semester" 
        />
        <StatCard 
          title="Dropout Risk Score" 
          value={`${user.riskScore}%`} 
          icon={<AlertTriangle size={24}/>} 
          isRisk 
          trend="System Calculated" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Risk Trend */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <TrendingUp className="text-emerald-400"/> My Risk Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{n:'Mon', r:10}, {n:'Tue', r:15}, {n:'Wed', r:12}, {n:'Thu', r:18}, {n:'Fri', r:user.riskScore}]}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="n" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px'}} />
                <Area 
                  type="monotone" 
                  dataKey="r" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorRisk)" 
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Student Quick Action */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-10 rounded-[40px] shadow-2xl flex flex-col justify-center items-center text-center">
          <QrIcon size={80} className="text-white mb-6 opacity-30" />
          <h3 className="text-2xl font-bold text-white mb-3">Mark Attendance</h3>
          <p className="text-emerald-100 mb-8 text-sm">
            Scan the unique session QR code to log your presence instantly.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard/mark-attendance'}
            className="bg-white text-emerald-700 font-black px-8 py-4 rounded-2xl w-full hover:bg-slate-50 transition-all shadow-xl active:scale-95"
          >
            Launch Scanner
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;