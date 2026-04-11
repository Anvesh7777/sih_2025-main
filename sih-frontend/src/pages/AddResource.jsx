import React, { useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Link as LinkIcon, Save, Info } from 'lucide-react';

function AddResource() {
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'E-Book', subject: '', link: ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Uploading to secure server...');
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (thumbnail) data.append('thumbnail', thumbnail);
    if (file) data.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/resources/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setMessage('Asset published successfully!');
      setFormData({ title: '', description: '', category: 'E-Book', subject: '', link: '' });
      setThumbnail(null); setFile(null);
    } catch (err) {
      setMessage(err.message || 'Failed to publish asset.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <UploadCloud className="text-indigo-400" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Resource Publisher</h1>
          <p className="text-slate-400 mt-1">Distribute academic materials and multimedia to the hub.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Data */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0f172a] border border-white/5 p-8 rounded-[32px] shadow-xl space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Asset Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-4 bg-slate-900 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all font-bold" placeholder="e.g., Intro to Algorithms PDF" required />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Academic Synopsis</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-4 bg-slate-900 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all text-sm leading-relaxed" required rows="4" placeholder="Brief overview of the resource content..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Subject Area</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full p-4 bg-slate-900 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all text-sm font-semibold" placeholder="e.g., Computer Science" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Asset Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 bg-slate-900 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all text-sm font-semibold appearance-none cursor-pointer">
                            <option>E-Book</option><option>Notes</option><option>Video</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Files & Actions */}
        <div className="space-y-6">
            <div className="bg-[#0f172a] border border-white/5 p-8 rounded-[32px] shadow-xl space-y-6">
                <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><ImageIcon size={14}/> Thumbnail</label>
                    <div className="relative group cursor-pointer">
                        <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="p-4 bg-slate-900 border border-dashed border-white/10 rounded-2xl text-center group-hover:border-indigo-500/50 transition-all">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{thumbnail ? thumbnail.name : 'Choose JPG/PNG'}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={14}/> Primary File</label>
                    <div className="relative group cursor-pointer">
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="p-4 bg-slate-900 border border-dashed border-white/10 rounded-2xl text-center group-hover:border-emerald-500/50 transition-all">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{file ? file.name : 'Select PDF Document'}</p>
                        </div>
                    </div>
                </div>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-black text-slate-600 uppercase">OR</span>
                    <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><LinkIcon size={14}/> Video URL</label>
                    <input type="text" name="link" placeholder="Paste YouTube link" value={formData.link} onChange={handleChange} className="w-full p-4 bg-slate-900 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500/50 text-xs transition-all" />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-500 text-white font-black rounded-[24px] hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 text-lg disabled:opacity-50 active:scale-95">
                {loading ? 'Publishing...' : <><Save size={20}/> Publish Asset</>}
            </button>

            {message && (
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <Info className="text-indigo-400 shrink-0" size={18} />
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">{message}</p>
                </div>
            )}
        </div>
      </form>
    </div>
  );
}
export default AddResource;