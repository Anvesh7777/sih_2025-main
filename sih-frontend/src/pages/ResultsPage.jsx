import React, { useState, useEffect } from 'react';
import { GraduationCap, FileText, AlertCircle, Award } from 'lucide-react';

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/results/my-results', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        // DEFENSIVE CHECK: Ensure results is an array
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
          if (data.message) setError(data.message);
        }
      } catch (err) {
        setError("Server failed to provide academic transcripts.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchResults();
  }, [token]);

  if (loading) return <div className="p-20 text-slate-500 text-center animate-pulse font-bold text-xs uppercase tracking-[0.3em]">Querying Exam Department...</div>;

  return (
    <div className="animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
          <GraduationCap size={28} />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Academic Transcripts</h1>
      </div>

      {error && (
        <div className="mb-10 p-5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-3xl flex items-center gap-4">
          <AlertCircle size={24} />
          <p className="text-sm font-bold uppercase tracking-wider">{error}</p>
        </div>
      )}

      {!Array.isArray(results) || results.length === 0 ? (
        <div className="bg-[#0f172a] border border-white/5 p-20 rounded-[40px] text-center shadow-2xl">
            <FileText size={48} className="mx-auto text-slate-700 mb-4 opacity-30" />
            <p className="text-slate-500 text-lg font-medium">No term records indexed for this account.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {results.map(result => (
            <div key={result._id} className="bg-[#0f172a] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
               <div className="bg-white/[0.02] p-10 flex justify-between items-center border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center font-black text-indigo-400 text-2xl border border-indigo-500/20">
                            {result.semester}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Semester Report Card</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Verified Record</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-black text-white">{result.sgpa}</p>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Term SGPA</p>
                    </div>
               </div>
               
               <div className="p-10">
                  <div className="space-y-4">
                    {Array.isArray(result.subjects) && result.subjects.map(sub => (
                      <div key={sub.subjectCode} className="flex justify-between items-center p-5 bg-white/[0.01] rounded-2xl border border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                          <div>
                            <p className="text-white font-bold text-sm">{sub.subjectName}</p>
                            <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">{sub.subjectCode} • {sub.credits} Credits</p>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 font-black text-lg shadow-inner">
                            {sub.grade}
                          </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultsPage;