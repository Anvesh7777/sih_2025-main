import React, { useState } from 'react';
import QRCode from "react-qr-code";
import { QrCode as QrIcon, Settings, ShieldCheck, Timer, ChevronDown } from 'lucide-react';

function AdminQrGenerator() {
  const [subject, setSubject] = useState('Computer Networks');
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subjects = ['Computer Networks', 'Database Management', 'Operating Systems', 'Software Engineering', 'Information Technology'];

  const handleGenerateQr = async () => {
    setLoading(true);
    setError('');
    setQrToken('');
    const token = localStorage.getItem('token'); // Standardized
    try {
      const response = await fetch('http://localhost:5000/api/attendance/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subject, branch: "Information technology" }) // branch mandatory for our new logic
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Generation error');
      setQrToken(data.qrToken);
    } catch (err) {
      setError("Authorization required or server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
          <QrIcon className="text-emerald-500" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">QR Authentication</h1>
          <p className="text-slate-400 mt-1">Generate dynamic tokens for real-time presence verification.</p>
        </div>
      </div>

      <div className="bg-[#0f172a] border border-white/5 rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Control Panel */}
            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        <Settings size={14}/> Active Subject
                    </label>
                    <div className="relative">
                        <select 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)} 
                            className="w-full p-4 bg-slate-900 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500/50 appearance-none cursor-pointer font-bold tracking-tight shadow-inner"
                        >
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-4.5 text-slate-500 pointer-events-none" size={18} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Timer size={18} className="text-emerald-500" />
                        <span>Token validity: <span className="text-white font-bold">10 Minutes</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <ShieldCheck size={18} className="text-emerald-500" />
                        <span>Security: <span className="text-white font-bold">Encrypted JWT</span></span>
                    </div>
                </div>

                <button 
                    onClick={handleGenerateQr} 
                    disabled={loading} 
                    className="w-full py-5 bg-emerald-500 text-slate-900 font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 text-lg disabled:opacity-50 active:scale-95"
                >
                    {loading ? 'Generating Hash...' : 'Broadcast Session'}
                </button>

                {error && <p className="text-red-400 text-center font-bold text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-bounce">{error}</p>}
            </div>

            {/* QR Result */}
            <div className="flex flex-col items-center justify-center">
                {qrToken ? (
                    <div className="bg-white p-6 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-8 border-slate-800 animate-in flip-in-y duration-700">
                        <QRCode value={qrToken} size={220} viewBox={`0 0 256 256`} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                        <div className="mt-6 text-center border-t border-slate-100 pt-4">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Channel</p>
                             <p className="text-slate-900 font-bold text-sm leading-tight mt-1">{subject}</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-64 h-64 border-4 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center text-slate-700">
                        <QrIcon size={64} className="mb-4 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest text-center px-8">Awaiting session start...</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminQrGenerator;