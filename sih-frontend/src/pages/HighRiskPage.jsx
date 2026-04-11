import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Mail, ShieldAlert, GraduationCap, ArrowUpDown } from 'lucide-react';

const HighRiskPage = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const token = localStorage.getItem('token'); // Standardized

  const fetchHighRisk = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/students/high-risk?search=${search}&branch=${branch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchHighRisk();
  }, [search, branch]);

  const sendAlert = async (id, name) => {
    if (window.confirm(`Dispatch academic support alert to ${name}?`)) {
      try {
        await axios.post(`http://localhost:5000/api/students/${id}/send-risk-alert`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Institutional alert dispatched successfully.");
      } catch (err) {
        alert("Failed to send alert. Check server logs.");
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Risk Management</h1>
          <p className="text-slate-400 mt-1 italic">Proactive monitoring of students requiring academic intervention.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search UID or Name..." 
                    className="w-full md:w-64 bg-slate-900 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-emerald-500 outline-none transition-all shadow-inner"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="relative">
                <Filter className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <select 
                    className="bg-slate-900 border border-white/5 rounded-2xl py-3 pl-12 pr-10 text-sm outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer font-bold text-slate-300"
                    onChange={(e) => setBranch(e.target.value)}
                >
                    <option value="All">All Branches</option>
                    <option value="Information technology">IT Branch</option>
                    <option value="Computer Science">CS Branch</option>
                </select>
            </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-white/5 bg-[#0f172a] shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/[0.03] text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Student Identity</th>
              <th className="px-6 py-5">Attendance</th>
              <th className="px-6 py-5">Academic</th>
              <th className="px-6 py-5 text-center">Calculated Risk</th>
              <th className="px-8 py-5 text-right">Intervention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20">
                            {s.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-none">{s.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-1.5 uppercase tracking-tighter">{s.enrollmentNumber}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: `${s.attendancePercentage}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-300">{s.attendancePercentage}%</span>
                    </div>
                </td>
                <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                        <GraduationCap size={14} className="text-slate-500" />
                        <span className="text-sm font-bold text-white">{s.cgpa}</span>
                    </div>
                </td>
                <td className="px-6 py-6">
                    <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                            s.riskScore > 50 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                            {s.riskScore}% Probability
                        </span>
                    </div>
                </td>
                <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => sendAlert(s._id, s.name)} 
                            className="p-2.5 bg-white/5 hover:bg-emerald-500 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm"
                            title="Send Risk Alert"
                        >
                            <Mail size={18} />
                        </button>
                        <button className="p-2.5 bg-white/5 hover:bg-indigo-500 text-slate-400 hover:text-white rounded-xl transition-all shadow-sm">
                            <ShieldAlert size={18} />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
            <div className="p-20 text-center">
                <p className="text-slate-500 font-medium italic">No students currently match your filter criteria.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskPage;