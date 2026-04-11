import React, { useState } from 'react';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';

function Login({ onToggleView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage('Access Granted. Redirecting...');
        // Standardized to 'token'
        localStorage.setItem('token', result.token);
        
        // Short delay for the "Success" message to be seen
        setTimeout(() => { window.location.href = '/dashboard'; }, 1200);
      } else {
        setMessage(result.message || 'Authentication failed.');
      }
    } catch (error) {
      setMessage('Server connectivity issues. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#020617] text-white p-4">
      <div className="w-full max-w-md bg-[#0f172a] p-10 rounded-3xl shadow-2xl border border-white/5 backdrop-blur-sm">
        <div className="text-center mb-10">
          <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Lock className="text-emerald-400" size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Secure Portal</h1>
          <p className="text-slate-400 mt-2">Enter your credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3.5 pl-12 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" 
                placeholder="name@college.edu"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-3.5 pl-4 pr-12 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" 
                placeholder="••••••••"
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-emerald-500 text-slate-900 font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Log In to Hub'}
          </button>

          {message && (
            <div className={`text-center p-3 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
              message.includes('Granted') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message}
            </div>
          )}
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Need an account?{' '}
          <button onClick={onToggleView} className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Sign Up</button>
        </p>
      </div>
    </div>
  );
}

export default Login;