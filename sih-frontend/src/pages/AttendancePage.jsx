import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, CheckCircle2, XCircle, Info, Loader2 } from 'lucide-react';

const getStatusStyles = (percentage) => {
  if (percentage < 75) return { color: 'text-red-400', bar: 'bg-red-500' };
  if (percentage < 85) return { color: 'text-orange-400', bar: 'bg-orange-500' };
  return { color: 'text-emerald-400', bar: 'bg-emerald-500' };
};

function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/attendance/my-attendance', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        // DEFENSIVE CHECK: Ensure we got an array
        if (Array.isArray(data)) {
          setAttendanceRecords(data);
        } else {
          setAttendanceRecords([]); // Reset to empty array if error object received
          if (data.message) setError(data.message);
        }
      } catch (err) {
        setError("Failed to sync attendance logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const subjectWiseAttendance = useMemo(() => {
    // CRITICAL FIX: Only run .reduce if attendanceRecords is a valid Array
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) return [];

    const grouped = attendanceRecords.reduce((acc, record) => {
      const subject = record.subject || 'Unknown';
      if (!acc[subject]) acc[subject] = [];
      acc[subject].push(record);
      return acc;
    }, {});

    return Object.entries(grouped).map(([subject, records]) => {
      const total = records.length;
      const present = records.filter(r => r.status === 'Present').length;
      const percentage = (present / total) * 100;
      return { subject, total, present, percentage };
    });
  }, [attendanceRecords]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p className="font-medium">Retrieving session history...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Attendance Summary</h1>
        {error && <p className="text-rose-400 mt-2 text-sm font-bold bg-rose-500/10 inline-block px-3 py-1 rounded-lg border border-rose-500/20">{error}</p>}
      </div>
      
      {subjectWiseAttendance.length === 0 ? (
        <div className="bg-[#0f172a] border border-white/5 p-20 rounded-[32px] text-center">
          <Calendar size={48} className="mx-auto text-slate-700 mb-4 opacity-40" />
          <p className="text-slate-500 text-lg font-medium">No session data found for your profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjectWiseAttendance.map(item => {
            const styles = getStatusStyles(item.percentage);
            return (
              <div key={item.subject} className="bg-[#0f172a] border border-white/5 p-8 rounded-[32px] hover:border-emerald-500/30 transition-all shadow-xl group">
                <h2 className="text-xl font-bold text-white mb-6 group-hover:text-emerald-400 transition-colors">{item.subject}</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500 uppercase tracking-widest text-[10px]">Session Status</span>
                    <span className={styles.color}>{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${styles.bar}`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                    <p className="text-slate-400 font-medium">
                      <span className="text-white font-bold">{item.present}</span> / {item.total} Classes
                    </p>
                    {item.percentage < 75 && <Info size={14} className="text-rose-400" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AttendancePage;