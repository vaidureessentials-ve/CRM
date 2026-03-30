import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/api';
import { 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  LogOut,
  Calendar,
  User,
  Radio
} from 'lucide-react';

const statusStyles = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Expired: 'bg-red-100 text-red-700 border-red-200',
  Converted: 'bg-accent/10 text-accent border-accent/20',
};

const FreeTrials = () => {
  const location = useLocation();
  const [trials, setTrials] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState({
    lead: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 7 days
    notes: ''
  });

  useEffect(() => {
    fetchTrials();
    fetchLeads();
    
    if (location.state?.leadId) {
      setForm(prev => ({ ...prev, lead: location.state.leadId }));
      setShowModal(true);
    }
  }, [location]);

  const fetchTrials = async () => {
    try {
      const res = await api.get('/freetrials');
      setTrials(res.data);
    } catch (err) {
      console.error('Failed to fetch trials', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  const handleStartTrial = async (e) => {
    e.preventDefault();
    try {
      await api.post('/freetrials', form);
      setShowModal(false);
      setForm({
        lead: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: ''
      });
      fetchTrials();
    } catch (err) {
      alert('Failed to start free trial');
    }
  };

  const calculateDaysLeft = (endDate) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diff = expiry - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredTrials = trials.filter(trial => 
    trial.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trial.lead?.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium tracking-tight">Syncing trial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 fade-in bg-background text-textMain transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-textMain tracking-tighter uppercase italic">Staging Matrix</h1>
          <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Lifecycle monitoring for prospect engagement sessions</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest flex items-center shadow-lg shadow-primary/25 hover:opacity-90 transition-all active:scale-95 w-fit"
        >
          <Plus size={20} className="mr-3" />
          Initialize Trial
        </button>
      </div>

      {/* Trial Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-surface border border-border rounded-[2rem] shadow-sm space-y-3 group">
            <Activity className="text-emerald-500 mb-2" size={28} />
            <p className="text-4xl font-black text-textMain tracking-tighter group-hover:scale-105 transition-transform inline-block">{trials.filter(t => t.status === 'Active').length}</p>
            <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">Active Nodes</p>
        </div>
        <div className="p-8 bg-surface border border-border rounded-[2rem] shadow-sm space-y-3 group">
            <Clock className="text-amber-500 mb-2" size={28} />
            <p className="text-4xl font-black text-textMain tracking-tighter group-hover:scale-105 transition-transform inline-block">{trials.filter(t => calculateDaysLeft(t.endDate) <= 2 && t.status === 'Active').length}</p>
            <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">Expiring (T-48h)</p>
        </div>
        <div className="p-8 bg-surface border border-border rounded-[2rem] shadow-sm space-y-3 group">
            <CheckCircle className="text-blue-500 mb-2" size={28} />
            <p className="text-4xl font-black text-textMain tracking-tighter group-hover:scale-105 transition-transform inline-block">{trials.filter(t => t.status === 'Converted').length}</p>
            <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">Closed Conversion</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by lead name or phone..."
            className="w-full pl-14 pr-6 py-4 bg-surface border border-border rounded-2xl focus:border-primary outline-none transition-all shadow-sm text-textMain placeholder:text-textMuted/40 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-4 bg-surface border border-border rounded-2xl text-textMuted font-black uppercase tracking-widest text-[10px] flex items-center hover:text-textMain transition-colors shadow-sm active:scale-95">
            <Filter size={16} className="mr-3" />
            Advanced
        </button>
      </div>

      {/* Trials List */}
      <div className="bg-surface rounded-[2.5rem] border border-border shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border text-textMuted transition-colors duration-300">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] pl-10 text-textMuted">Lead Identity</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center text-textMuted">Temporal Window</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center text-textMuted">Velocity</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-textMuted">State</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-right pr-10 text-textMuted">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredTrials.map((trial) => {
                const daysLeft = calculateDaysLeft(trial.endDate);
                return (
                  <tr key={trial._id} className="hover:bg-background transition-all group cursor-default">
                    <td className="px-8 py-6 pl-10">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center text-textMuted shadow-inner">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-black text-textMain text-sm tracking-tight group-hover:text-primary transition-colors">{trial.lead?.name || 'Unknown Entity'}</p>
                          <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest mt-0.5 opacity-60">{trial.lead?.phone || 'NO_COMMS'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="text-xs font-black text-textMain tracking-tight">{new Date(trial.startDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-textMuted font-medium uppercase tracking-widest mt-0.5 opacity-40">until {new Date(trial.endDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {trial.status === 'Active' ? (
                        <div className={`flex flex-col items-center ${daysLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-textMain'}`}>
                           <p className="text-lg font-black tracking-tighter">{daysLeft}D</p>
                           <p className="text-[9px] uppercase font-black tracking-[0.2em] opacity-40">Rem.</p>
                        </div>
                      ) : (
                        <LogOut size={20} className="mx-auto text-textMuted opacity-20" />
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all ${
                        trial.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        trial.status === 'Converted' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {trial.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right pr-10">
                       <button className="p-2.5 text-textMuted bg-background border border-border rounded-xl transition-all hover:text-accent hover:border-accent shadow-sm group-hover:opacity-100 opacity-0 transform translate-x-2 group-hover:translate-x-0">
                         <MoreHorizontal size={18} />
                       </button>
                    </td>
                  </tr>
                );
              })}
              {filteredTrials.length === 0 && (
                <tr>
                   <td colSpan="5" className="px-8 py-32 text-center opacity-10">
                      <Activity size={72} className="mx-auto text-textMuted mb-4" />
                      <p className="text-xl font-black text-textMuted uppercase tracking-[0.4em] italic leading-none">Vacuum Detected</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start Trial Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
          <div className="bg-surface rounded-[2.5rem] w-full max-w-xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-border overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-500"></div>
             <div className="px-10 py-8 border-b border-border flex justify-between items-center bg-background/30">
                <div>
                   <h3 className="text-2xl font-black text-textMain tracking-tighter uppercase italic">Staging Protocol</h3>
                   <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Initializing prospect lifecycle sequence</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-textMuted hover:text-textMain transition-colors">
                   <AlertCircle size={28} />
                </button>
             </div>
             
             <form onSubmit={handleStartTrial} className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Target Prospect Node</label>
                    <select 
                      required
                      className="w-full px-6 py-4 bg-background border border-border rounded-2xl focus:border-primary outline-none transition-all font-bold text-textMain shadow-sm appearance-none cursor-pointer"
                      value={form.lead}
                      onChange={e => setForm({...form, lead: e.target.value})}
                    >
                      <option value="" className="bg-surface">Choose Entity...</option>
                      {leads.map(l => (
                        <option key={l._id} value={l._id} className="bg-surface">{l.name} // {l.phone}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Activation Date</label>
                        <input 
                          type="date" 
                          className="w-full px-5 py-3.5 bg-background border border-border rounded-2xl focus:border-primary outline-none font-bold text-textMain shadow-sm cursor-pointer"
                          value={form.startDate}
                          onChange={e => setForm({...form, startDate: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Expiration Marker</label>
                        <input 
                          type="date" 
                          className="w-full px-5 py-3.5 bg-background border border-border rounded-2xl focus:border-primary outline-none font-bold text-textMain shadow-sm cursor-pointer"
                          value={form.endDate}
                          onChange={e => setForm({...form, endDate: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Intelligence Notes</label>
                    <textarea 
                       className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:border-primary outline-none resize-none font-medium h-32 text-textMain shadow-sm"
                       placeholder="e.g. Focus on algorithmic trading integration..."
                       value={form.notes}
                       onChange={e => setForm({...form, notes: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 border border-border rounded-2xl font-black text-textMuted uppercase tracking-widest hover:text-textMain transition-all active:scale-95 text-[10px]">Abort</button>
                   <button type="submit" className="flex-[2] py-4 px-8 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/25 hover:opacity-90 active:scale-95 transition-all text-[10px]">Launch Lifecycle</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeTrials;
