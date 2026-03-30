import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Clock, Plus, CheckCircle, Trash2, Phone, XCircle, Bell } from 'lucide-react';

const statusColor = {
  Pending: 'bg-amber-100 text-amber-700',
  Done: 'bg-emerald-100 text-emerald-700',
  Missed: 'bg-red-100 text-red-600',
};

const FollowUp = ({ user }) => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState({
    contactName: '', contactPhone: '', followUpDate: '', notes: ''
  });

  useEffect(() => { fetchFollowUps(); }, []);

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/followups');
      setFollowUps(res.data);
    } catch (err) {
      console.error('Failed to fetch follow-ups', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/followups', form);
      setShowModal(false);
      setForm({ contactName: '', contactPhone: '', followUpDate: '', notes: '' });
      fetchFollowUps();
    } catch (err) {
      alert('Failed to schedule follow-up');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/followups/${id}`, { status });
      fetchFollowUps();
    } catch (err) {
      alert('Failed to update follow-up');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this follow-up?')) return;
    try {
      await api.delete(`/followups/${id}`);
      fetchFollowUps();
    } catch (err) {
      alert('Failed to delete follow-up');
    }
  };

  const today = new Date().toDateString();
  const todayFollowUps = followUps.filter(f => new Date(f.followUpDate).toDateString() === today);
  const pending = followUps.filter(f => f.status === 'Pending');

  const filtered = filterStatus === 'All' ? followUps : followUps.filter(f => f.status === filterStatus);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse font-bold">Loading Follow-ups...</div>;

  return (
    <div className="p-8 space-y-8 fade-in bg-background text-textMain transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-border pb-8">
        <div>
          <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase italic">Persistence Queue</h2>
          <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Scheduled callback terminal for lead retention</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest flex items-center shadow-lg shadow-primary/25 hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={18} className="mr-3" />
          Schedule Follow-up
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-[2rem] border border-border shadow-sm group">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2">High Priority Today</p>
          <p className="text-4xl font-black text-textMain tracking-tighter transition-transform group-hover:scale-105 inline-block">{todayFollowUps.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-[2rem] border border-border shadow-sm group">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Backlog Persistence</p>
          <p className="text-4xl font-black text-textMain tracking-tighter transition-transform group-hover:scale-105 inline-block">{pending.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-[2rem] border border-border shadow-sm group">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Nodes Resolved</p>
          <p className="text-4xl font-black text-textMain tracking-tighter transition-transform group-hover:scale-105 inline-block">{followUps.filter(f => f.status === 'Done').length}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3 bg-surface p-1.5 rounded-[1.5rem] border border-border w-fit shadow-sm">
        {['All', 'Pending', 'Done', 'Missed'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-8 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-textMuted hover:text-textMain'}`}
          >{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-[2.5rem] border border-border shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-black text-textMuted uppercase tracking-[0.2em] border-b border-border bg-background/50">
                <th className="px-6 py-5 pl-8">Live State</th>
                <th className="px-5 py-5">Temporal Window</th>
                <th className="px-5 py-5">Target Entity</th>
                <th className="px-5 py-5">Intelligence logs</th>
                <th className="px-5 py-5 text-right pr-8">Executive Controls</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border/40">
              {filtered.map(fu => {
                const isPast = new Date(fu.followUpDate) < new Date() && fu.status === 'Pending';
                return (
                  <tr key={fu._id} className={`transition-all group border-b border-border/40 last:border-0 cursor-default ${isPast ? 'bg-red-500/5' : 'hover:bg-background/50'}`}>
                    <td className="px-6 py-5 pl-8">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all ${
                        fu.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        fu.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>{fu.status}</span>
                      {isPast && <span className="ml-3 text-[9px] font-black text-red-500 tracking-widest animate-pulse">CRITICAL OVERDUE</span>}
                    </td>
                    <td className="px-5 py-5 text-xs text-textMain font-black tracking-tight whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Bell size={14} className={isPast ? 'text-red-500' : 'text-primary'} />
                        {new Date(fu.followUpDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="font-black text-textMain tracking-tight group-hover:text-accent transition-colors">{fu.contactName || '—'}</div>
                      {fu.contactPhone && (
                        <div className="flex items-center gap-1.5 text-[10px] text-textMuted font-medium uppercase tracking-widest mt-0.5 opacity-60">
                          <Phone size={10} />{fu.contactPhone}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-5 max-w-[200px]">
                      <p className="text-[11px] text-textMuted font-medium italic truncate opacity-50">{fu.notes || '—'}</p>
                    </td>
                    <td className="px-5 py-5 text-right pr-8">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        {fu.status === 'Pending' && (
                          <button onClick={() => handleUpdateStatus(fu._id, 'Done')} className="p-2.5 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-500/20" title="Mark Done"><CheckCircle size={16} /></button>
                        )}
                        {fu.status === 'Pending' && (
                          <button onClick={() => handleUpdateStatus(fu._id, 'Missed')} className="p-2.5 text-orange-500 bg-orange-500/10 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm border border-orange-500/20" title="Mark Missed"><XCircle size={16} /></button>
                        )}
                        <button onClick={() => handleDelete(fu._id)} className="p-2.5 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm border border-red-500/20" title="Purge entry"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-textMuted italic font-black uppercase tracking-[0.3em] opacity-20">No active persistence nodes detected.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-surface rounded-[2.5rem] w-full max-w-xl p-10 shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-500"></div>
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black text-textMain tracking-tighter uppercase italic text-primary">Persistence Entry</h3>
                <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Staging objective based temporal callback</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-background rounded-full text-textMuted transition-colors"><XCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Agent / Entity Name</label>
                  <input type="text" value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} 
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-primary outline-none text-textMain transition-all shadow-sm" placeholder="Target Identity" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Uplink Phone</label>
                  <input type="text" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} 
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-primary outline-none text-textMain transition-all shadow-sm" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Temporal Window (Date & Time) *</label>
                <input required type="datetime-local" value={form.followUpDate} onChange={e => setForm({...form, followUpDate: e.target.value})} 
                  className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-primary outline-none text-textMain transition-all shadow-sm cursor-pointer" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Objective / Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} 
                  className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-primary outline-none text-textMain transition-all shadow-sm resize-none" placeholder="Callback intelligence..." />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-textMuted hover:bg-background rounded-2xl transition-all">Abort</button>
                <button type="submit" className="px-8 py-3 text-xs font-black uppercase tracking-widest text-white bg-primary hover:opacity-90 rounded-2xl shadow-lg shadow-primary/25 transition-all active:scale-95">Commit Persistence</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUp;
