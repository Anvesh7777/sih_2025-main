import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, CheckCircle, XCircle, Clock, ListFilter } from 'lucide-react';

function LectureDetails({ lecture, token }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAttendanceForLecture = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/all?date=${lecture.date.split('T')[0]}&subject=${lecture.subject}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      // Filter logic to ensure we only see scans after the lecture started
      setRecords(data.filter(rec => new Date(rec.createdAt).getTime() > new Date(lecture.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAttendanceForLecture();
  }, [lecture]);

  const handleReconcile = async () => {
    setMessage('Processing batch update...');
    try {
        const response = await fetch(`http://localhost:5000/api/attendance/reconcile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ lectureId: lecture._id })
        });
        const data = await response.json();
        setMessage(data.message);
        setTimeout(() => fetchAttendanceForLecture(), 1500);
    } catch (err) {
        setMessage("Reconciliation failed.");
    }
  };

  return (
    <div className="mt-10 bg-[#0f172a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Users className="text-emerald-500" /> {lecture.subject}
            </h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">Session started at {new Date(lecture.createdAt).toLocaleTimeString()}</p>
        </div>
        <button 
            onClick={handleReconcile} 
            className="flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 active:scale-95 text-sm"
        >
            <XCircle size={18}/> Mark All Absent
        </button>
      </div>

      <div className="p-8">
        {message && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-sm font-bold animate-pulse">{message}</div>}
        
        {isLoading ? (
            <div className="text-center py-10 text-slate-500">Retrieving student logs...</div>
        ) : (
            <div className="overflow-hidden rounded-2xl border border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Time Logged</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {records.map(rec => (
                            <tr key={rec._id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="px-6 py-4 text-white font-medium">{rec.student?.name}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${rec.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                            {rec.status === 'Present' ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                                            {rec.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-500 text-xs font-mono">
                                    {new Date(rec.createdAt).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center text-slate-500 italic">No attendance scans detected for this session.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}

function AdminAttendanceView() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token'); // Standardized

  const handleFetchLectures = async () => {
    setLoading(true);
    setMessage('');
    setLectures([]);
    setSelectedLecture(null);
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/lectures?date=${date}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error');
      setLectures(data);
      if (data.length === 0) setMessage('Zero lectures indexed for this timestamp.');
    } catch (err) {
      setMessage("Could not establish connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Attendance Control</h1>
        <p className="text-slate-400 mt-2">Historical session audit and absentee reconciliation.</p>
      </div>

      <div className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl mb-10 flex flex-col md:flex-row items-end gap-6 shadow-xl">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Calendar size={14} className="text-emerald-500" /> Target Audit Date
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            className="w-full p-4 bg-slate-900 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
          />
        </div>
        <button 
            onClick={handleFetchLectures} 
            disabled={loading} 
            className="w-full md:w-auto bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2"
        >
            <Search size={20} /> {loading ? 'Scanning...' : 'Fetch Sessions'}
        </button>
      </div>

      {message && <div className="text-center p-10 bg-white/5 rounded-3xl text-slate-500 font-medium italic border border-dashed border-white/10">{message}</div>}

      {lectures.length > 0 && (
        <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
                <ListFilter size={18} className="text-emerald-500" />
                <h2 className="text-xl font-bold text-white">Select Session to Reconcile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lectures.map(lecture => (
                    <div 
                        key={lecture._id} 
                        className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            selectedLecture?._id === lecture._id 
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-emerald-500/10' 
                            : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                        }`} 
                        onClick={() => setSelectedLecture(lecture)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-white text-lg leading-tight">{lecture.subject}</p>
                            <Clock size={16} className={selectedLecture?._id === lecture._id ? 'text-emerald-400' : 'text-slate-600'} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Started: {new Date(lecture.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      )}

      {selectedLecture && <LectureDetails lecture={selectedLecture} token={token} />}
    </div>
  );
}

export default AdminAttendanceView;