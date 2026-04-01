import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Users, PhoneCall, Info, BadgeCheck } from 'lucide-react';

const Details = () => {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssociates();
  }, []);

  const fetchAssociates = async () => {
    try {
      const res = await api.get('/auth/associates');
      setAssociates(res.data);
    } catch (err) {
      console.error('Failed to fetch associates', err);
    } finally {
      setLoading(false);
    }
  };

  const totalClients = associates.reduce((acc, current) => acc + (current.clients?.length || 0), 0);
  const totalCalls = associates.reduce((acc, current) => acc + (current.calls?.length || 0), 0);
  const activeAssociates = associates.filter(a => a.role !== 'admin').length;

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Loading Platform Details...</div>;

  return (
    <div className="p-8 space-y-10 fade-in bg-background text-textMain transition-colors duration-300 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-8">
        <div>
          <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase italic">Platform Topology</h2>
          <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Full-spectrum architecture audit and node orchestration overview</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 flex items-center shadow-lg shadow-emerald-500/5 italic">
          <BadgeCheck size={16} className="mr-3" />
          Network Synchronized
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface p-8 border border-border rounded-[2rem] shadow-sm relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] mb-3">Operator Nodes</p>
          <div className="flex items-end justify-between">
            <h3 className="text-5xl font-black text-textMain tracking-tighter group-hover:scale-105 transition-transform origin-left">{activeAssociates}</h3>
            <Users size={32} className="text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity mb-1" />
          </div>
        </div>
        <div className="bg-surface p-8 border border-border rounded-[2rem] shadow-sm relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] mb-3">Client Clusters</p>
          <div className="flex items-end justify-between">
            <h3 className="text-5xl font-black text-textMain tracking-tighter group-hover:scale-105 transition-transform origin-left">{totalClients}</h3>
            <Users size={32} className="text-emerald-500 opacity-20 group-hover:opacity-40 transition-opacity mb-1" />
          </div>
        </div>
        <div className="bg-surface p-8 border border-border rounded-[2rem] shadow-sm relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] mb-3">Lifetime Sequences</p>
          <div className="flex items-end justify-between">
            <h3 className="text-5xl font-black text-textMain tracking-tighter group-hover:scale-105 transition-transform origin-left">{totalCalls}</h3>
            <PhoneCall size={32} className="text-primary opacity-20 group-hover:opacity-40 transition-opacity mb-1" />
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="px-10 py-6 border-b border-border bg-background/30 flex items-center justify-between">
           <div className="flex items-center">
              <Info size={18} className="text-primary mr-3" />
              <h3 className="text-[10px] font-black text-textMain uppercase tracking-[0.2em] italic">Full Metadata Ingest</h3>
           </div>
           <div className="text-[9px] font-black text-textMuted uppercase tracking-widest opacity-40">
              Synchronized @ {new Date().toLocaleTimeString()}
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/20 text-textMuted">
                <th className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em]">Operator Identity</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em]">SIP Cipher</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em]">Identity Node</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em]">Hierarchy Status</th>
                <th className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-right">Integrity Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {associates.map(assoc => (
                <tr key={assoc._id || assoc.id} className="hover:bg-background/80 transition-all group">
                  <td className="px-10 py-6 font-black text-textMain text-sm tracking-tight group-hover:text-primary transition-colors">{assoc.name}</td>
                  <td className="px-8 py-6 font-black text-primary tabular-nums text-xs tracking-[0.2em] uppercase opacity-60">SIP/{assoc.sipExtension}</td>
                  <td className="px-8 py-6 text-[10px] font-black text-textMuted tracking-widest uppercase italic">{assoc.email}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current shadow-sm ${assoc.role === 'admin' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {assoc.role}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right font-black text-textMain tabular-nums tracking-tighter text-lg pr-14">
                    {(assoc.clients?.length || 0) + (assoc.calls?.length || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Details;
