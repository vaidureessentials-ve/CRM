import React, { useState } from 'react';
import api from '../api/api';
import { Shield } from 'lucide-react';

const Login = ({ onLogin, associates }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background text-textMain relative overflow-hidden font-sans transition-colors duration-300">
      {/* Dynamic Light Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] animate-pulse-soft"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse-soft"></div>
      
      <div className="w-full max-w-md p-10 m-4 glass-panel border-none shadow-[0_40px_100px_rgba(6,78,59,0.1)] flex flex-col items-center relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-10 w-full text-center">
          <div className="w-20 h-20 mb-6 relative group">
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-25"></div>
            <div className="relative p-5 text-white rounded-[2rem] bg-gradient-to-br from-primary via-emerald-800 to-accent shadow-2xl shadow-accent/20 cursor-default flex items-center justify-center">
              <Shield size={36} strokeWidth={1} className="group-hover:scale-110 transition-transform drop-shadow-lg" />
            </div>
          </div>
          
          <h2 className="text-5xl font-[900] tracking-[-0.05em] mb-1 bg-gradient-to-r from-primary via-emerald-700 to-accent bg-clip-text text-transparent uppercase py-1 text-gradient">
            AMIGO
          </h2>
          <div className="h-1.5 w-16 premium-gradient mt-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]"></div>
          
          <p className="mt-8 text-[11px] font-[800] text-textMuted uppercase tracking-[0.4em] leading-none opacity-40">
            Secure Enterprise Gateway
          </p>
        </div>
        
        {error && (
          <div className="w-full p-4 mb-8 text-[10px] font-black text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center uppercase tracking-widest animate-shake">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">Username</label>
            </div>
            <input 
              type="text" 
              required
              className="w-full px-7 py-3 bg-background border border-border rounded-[2rem] focus:ring-8 focus:ring-accent/5 focus:border-accent transition-all duration-500 outline-none text-sm font-bold text-textMain placeholder:text-textMuted/30 shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">Password</label>
              <button type="button" className="text-[9px] font-black text-accent hover:text-blue-400 uppercase tracking-widest transition-colors">Recover?</button>
            </div>
            <input 
              type="password" 
              required
              className="w-full px-7 py-3 bg-background border border-border rounded-[2rem] focus:ring-8 focus:ring-accent/5 focus:border-accent transition-all duration-500 outline-none text-sm font-bold text-textMain placeholder:text-textMuted/30 shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full px-7 py-3.5 mt-6 font-black text-white transition-all rounded-[2rem] premium-gradient shadow-[0_15px_30px_rgba(34,211,238,0.3)] hover:shadow-[0_20px_40px_rgba(34,211,238,0.4)] hover:translate-y-[-2px] active:scale-[0.98] uppercase text-[11px] tracking-[0.25em]"
          >
            Authenticate
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
