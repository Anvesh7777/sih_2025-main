import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Library, Search, FileType, AlertCircle } from 'lucide-react';

function ELibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/resources', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        // DEFENSIVE CHECK: Ensure data is an array
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          setResources([]); 
          if (data.message) setError(data.message);
        }
      } catch (err) {
        setError("Database synchronization failed.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchResources();
  }, [token]);

  if (loading) return <div className="p-20 text-slate-500 text-center animate-pulse font-bold tracking-widest uppercase text-xs">Indexing Digital Assets...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:row justify-between items-start md:items-center gap-4 mb-12">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">E-Library</h1>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 animate-shake">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {!Array.isArray(resources) || resources.length === 0 ? (
        <div className="bg-[#0f172a] border border-white/5 p-20 rounded-[40px] text-center">
            <Library size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 text-lg font-medium">Digital repository is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map(resource => (
            <div key={resource._id} className="group bg-[#0f172a] rounded-[32px] shadow-2xl border border-white/5 overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-slate-800">
                <img 
                  src={resource.thumbnailPath || 'https://via.placeholder.com/400x300?text=No+Preview'} 
                  alt={resource.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <span className="absolute bottom-4 left-4 text-[10px] font-black bg-emerald-500 text-slate-900 px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                  {resource.subject}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-emerald-400 transition-colors">{resource.title}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                    <FileType size={12}/> {resource.category}
                </div>
                <a 
                  href={resource.filePath || resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 font-black py-3 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95"
                >
                  View <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ELibrary;