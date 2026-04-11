import React, { useState, useEffect } from 'react';
import { User, Mail, Hash, BookOpen, Edit3, Save, X, ShieldCheck } from 'lucide-react';

function ProfilePage() {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [message, setMessage] = useState('');

  const branches = ['Information technology', 'Computer Science', 'Electronics', 'Mechanical', 'Civil'];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/students/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setStudent(data);
        setName(data.name);
        setBranch(data.branch);
      } catch (err) {
        console.error("Profile load error:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/students/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, branch })
      });
      const updatedData = await response.json();
      if (!response.ok) throw new Error(updatedData.message);
      
      setStudent(updatedData);
      setMessage('Update verified and synced.');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!student) return <div className="text-slate-400 p-8">Loading profile metadata...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Student Identity</h1>
        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
          <ShieldCheck size={14}/> Verified User
        </div>
      </div>

      <div className="bg-[#0f172a] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
        {/* Profile Header Background */}
        <div className="h-32 bg-gradient-to-r from-emerald-600/20 to-indigo-600/20 border-b border-white/5"></div>
        
        <form onSubmit={handleUpdateProfile} className="p-10 -mt-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Placeholder */}
            <div className="w-32 h-32 rounded-3xl bg-slate-800 border-4 border-[#0f172a] flex items-center justify-center text-slate-500 shadow-xl">
               <User size={48} />
            </div>

            <div className="flex-1 space-y-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Editable: Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider"><User size={14}/> Full Name</label>
                  {isEditing ? (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 transition-all"/>
                  ) : (
                    <p className="text-xl font-bold text-white">{student.name}</p>
                  )}
                </div>

                {/* Editable: Branch Select */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider"><BookOpen size={14}/> Branch</label>
                  {isEditing ? (
                    <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 transition-all">
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  ) : (
                    <p className="text-xl font-bold text-white">{student.branch}</p>
                  )}
                </div>

                {/* Read-Only: Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider"><Mail size={14}/> Email Address</label>
                  <p className="text-lg text-slate-400 font-medium">{student.email}</p>
                </div>

                {/* Read-Only: ID */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider"><Hash size={14}/> Enrollment ID</label>
                  <p className="text-lg text-slate-400 font-mono font-medium uppercase">{student.enrollmentNumber}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                {message && <p className="text-sm font-bold text-emerald-400 animate-pulse">{message}</p>}
                <div className="flex gap-4 ml-auto">
                    {isEditing ? (
                        <>
                        <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all font-bold">
                            <X size={18}/> Cancel
                        </button>
                        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-slate-900 rounded-xl hover:bg-emerald-400 transition-all font-bold shadow-lg shadow-emerald-500/20">
                            <Save size={18}/> Save Changes
                        </button>
                        </>
                    ) : (
                        <button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-8 py-3 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-all font-bold shadow-lg">
                            <Edit3 size={18}/> Edit Profile
                        </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;