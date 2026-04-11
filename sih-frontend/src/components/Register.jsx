import React, { useState } from 'react';
import { UserPlus, User, Mail, Hash, BookOpen, Lock, Loader2 } from 'lucide-react';

function Register({ onToggleView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [branch, setBranch] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const branches = [
    'Information technology', 
    'Computer Science', 
    'Electronics', 
    'Mechanical', 
    'Civil'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, enrollmentNumber, branch, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Registration Successful! Redirecting to login...');
        setTimeout(() => { onToggleView(); }, 2000);
      } else {
        setMessage(result.message || 'Registration failed.');
      }
    } catch (error) {
      setMessage('Connectivity error. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#020617] text-white p-4 py-12">
      <div className="w-full max-w-lg bg-[#0f172a] p-10 rounded-3xl shadow-2xl border border-white/5">
        <div className="text-center mb-10">
          <div className="bg-indigo-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <UserPlus className="text-indigo-400" size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-slate-400 mt-2">Join the college success network.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-500" size={16} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 pl-11 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-all text-sm" placeholder="John Doe" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Enrollment No.</label>
              <div className="relative">
                <Hash className="absolute left-4 top-3.5 text-slate-500" size={16} />
                <input type="text" value={enrollmentNumber} onChange={(e) => setEnrollmentNumber(e.target.value)} className="w-full p-3 pl-11 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-all text-sm uppercase" placeholder="0123CS..." required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-500" size={16} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 pl-11 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-all text-sm" placeholder="john@university.edu" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Academic Branch</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-3.5 text-slate-500" size={16} />
              <select 
                value={branch} 
                onChange={(e) => setBranch(e.target.value)} 
                className="w-full p-3 pl-11 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-all text-sm appearance-none cursor-pointer" 
                required
              >
                <option value="" disabled>Select your branch</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500" size={16} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 pl-11 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-all text-sm" placeholder="Minimum 6 characters" minLength={6} required />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Registration'}
          </button>
          
          {message && (
            <div className={`text-center p-3 rounded-lg text-sm font-medium ${
              message.includes('Successful') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message}
            </div>
          )}
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{' '}
          <button onClick={onToggleView} className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Log In</button>
        </p>
      </div>
    </div>
  );
}

export default Register;