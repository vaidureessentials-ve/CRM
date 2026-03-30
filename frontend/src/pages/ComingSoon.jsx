import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = ({ title, icon: Icon = Construction }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 h-[80vh] fade-in bg-background text-textMain transition-colors duration-300">
      <div className="bg-primary/10 p-12 rounded-[3.5rem] mb-12 animate-pulse border border-primary/20 shadow-2xl shadow-primary/10 relative group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <Icon className="text-primary relative z-10" size={100} strokeWidth={0.5} />
      </div>
      <h2 className="text-6xl font-black text-textMain mb-6 tracking-tighter uppercase italic">{title}</h2>
      <p className="text-textMuted max-w-lg text-center leading-relaxed text-[11px] font-black uppercase tracking-[0.3em] opacity-60">
        We are architecting a high-performance module for your CRM workflow. 
        Expect deep sequence analytics and node orchestration shortly.
      </p>
      
      <div className="mt-16 flex gap-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center px-10 py-4 bg-surface border border-border text-textMain font-black text-[10px] uppercase tracking-widest rounded-2xl hover:border-primary transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={18} className="mr-3" />
          Abort Sequence
        </button>
        <button 
          className="px-10 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:translate-y-[-4px] transition-all active:scale-95 border border-primary/20"
        >
          Request Priority Access
        </button>
      </div>

      <div className="mt-24 grid grid-cols-4 gap-6 opacity-10">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-1 w-32 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;
