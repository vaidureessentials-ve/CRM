import React from 'react';
import { User, Mail, Phone, Hash, Award, Calendar } from 'lucide-react';

const Profile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="p-8 space-y-12 fade-in bg-background text-textMain transition-colors duration-300 min-h-screen">
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10 border-b border-border pb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary via-[#1e293b] to-accent flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary/30 rotate-3 border-4 border-surface relative group overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {user.name.charAt(0)}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-black text-textMain tracking-tighter uppercase italic">{user.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start mt-4 gap-4">
                <span className="px-6 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 uppercase tracking-[0.2em] shadow-lg shadow-primary/5">
                    Operator Type: {user.role}
                </span>
                <span className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] flex items-center opacity-40 italic">
                    <Calendar size={14} className="mr-3 text-primary" />
                    Archive Entry: March 2026
                </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-surface border border-border p-10 space-y-8 rounded-[3rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0">
             <User size={120} />
          </div>
          <h3 className="text-xl font-black text-textMain pb-6 border-b border-border/40 uppercase italic tracking-tighter">Identity Specification</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2 p-5 bg-background/50 rounded-2xl border border-border/30">
                <p className="text-[9px] text-textMuted uppercase font-black tabular-nums tracking-[0.2em] opacity-40 italic">Uplink Address</p>
                <div className="flex items-center text-textMain">
                  <Mail size={14} className="mr-3 text-primary" />
                  <p className="text-sm font-black tracking-tight truncate">{user.email}</p>
                </div>
            </div>

            <div className="space-y-2 p-5 bg-background/50 rounded-2xl border border-border/30">
                <p className="text-[9px] text-textMuted uppercase font-black tabular-nums tracking-[0.2em] opacity-40 italic">SIP Identifier</p>
                <div className="flex items-center text-textMain">
                  <Phone size={14} className="mr-3 text-primary" />
                  <p className="text-sm font-black tracking-widest tabular-nums italic">EXT: {user.sipExtension}</p>
                </div>
            </div>

            <div className="space-y-2 p-5 bg-background/50 rounded-2xl border border-border/30 col-span-1 md:col-span-2">
                <p className="text-[9px] text-textMuted uppercase font-black tabular-nums tracking-[0.2em] opacity-40 italic">System Status</p>
                <div className="flex items-center text-textMain">
                  <Award size={14} className="mr-3 text-emerald-500" />
                  <p className="text-xs font-black uppercase tracking-widest">Verified Multi-Cluster Associate Protocol v4.2</p>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-10 space-y-8 rounded-[3rem] shadow-sm relative overflow-hidden group flex flex-col justify-between">
            <div className="relative z-10 flex-1">
                <h3 className="text-xl font-black text-textMain mb-8 uppercase italic tracking-tighter">Engagement Metrics</h3>
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-background p-8 rounded-[2rem] border border-border shadow-inner group-hover:border-primary/30 transition-all flex items-end justify-between">
                        <div>
                          <p className="text-[9px] text-textMuted uppercase font-black tracking-[0.3em] mb-2 italic">Active Nodes Managed</p>
                          <p className="text-6xl font-black text-textMain tracking-tighter tabular-nums leading-none">{user.clients?.length || 0}</p>
                        </div>
                        <User size={48} className="text-primary opacity-10 mb-[-4px]" />
                    </div>
                </div>
            </div>
            <div className="mt-10 relative z-10">
                <button className="w-full py-5 bg-textMain text-background text-[10px] font-black rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-[0.3em] hover:bg-primary hover:text-white border border-border/50">
                    Export Analytical Ledger
                </button>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-accent/5 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
