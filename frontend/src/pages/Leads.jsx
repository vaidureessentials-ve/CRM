import React, { useState, useEffect } from 'react';
import api from '../api/api';
import {
  UserPlus, Search, Trash2, CheckCircle, Mail, Phone,
  Building2, Eye, XCircle, MoreHorizontal, BookOpen, Clock, Star, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SOURCES = ['All', 'Fresh Pool', 'Website', 'Referral', 'Cold Call'];
const STATUSES_ALL = ['All', 'Unread', 'Read', 'Converted', 'Disposed'];
const SEGMENTS = ['All', 'Fresh Pool', 'Potential Pool', 'Prime Pool', 'Hot'];

const statusStyle = {
  Unread: 'bg-amber-100 text-amber-700',
  Read: 'bg-blue-100 text-blue-700',
  Converted: 'bg-accent/10 text-accent',
  Disposed: 'bg-red-100 text-red-600',
};

const ActionBtn = ({ onClick, title, children, color = 'bg-primary' }) => (
  <button
    onClick={onClick}
    title={title}
    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:opacity-90 active:scale-95 ${color}`}
  >
    {children}
  </button>
);

const Leads = ({ user }) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [filterSegment, setFilterSegment] = useState('All');
  const [filterMarkedAs, setFilterMarkedAs] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newLead, setNewLead] = useState({
    name: '', email: '', phone: '', company: '', source: 'Fresh Pool', notes: '', segment: 'Fresh Pool'
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', newLead);
      setShowAddModal(false);
      setNewLead({ name: '', email: '', phone: '', company: '', source: 'Fresh Pool', notes: '', segment: 'Fresh Pool' });
      fetchLeads();
    } catch (err) {
      alert('Failed to add lead');
    }
  };

  const handleSO = (lead) => {
    if (lead.status !== 'Converted') {
      alert('Sales Orders can only be created for Converted Clients. Please convert this lead first.');
      return;
    }
    // Navigate to Sales Order page. The page will fetch clients and we can pass the name for pre-filtering or just search.
    // Better: We should ideally have the clientId. For now, we navigate and the user can select.
    navigate('/dashboard/salesorder', { state: { clientName: lead.name } });
  };

  const handleFT = (lead) => {
    navigate('/dashboard/freetrial', { state: { leadId: lead._id } });
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/leads/${id}`, { status });
      fetchLeads();
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleConvertLead = async (id) => {
    if (!window.confirm('Convert this lead to a permanent client?')) return;
    try {
      await api.post(`/leads/${id}/convert`, {});
      fetchLeads();
    } catch (err) {
      alert('Failed to convert lead');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  const filtered = leads.filter(l => {
    const matchSearch = l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone?.includes(searchTerm) || l.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || l.status === filterStatus;
    const matchSource = filterSource === 'All' || l.source === filterSource;
    const matchSegment = filterSegment === 'All' || (l.segment || 'Fresh Pool') === filterSegment;
    const matchMarkedAs = filterMarkedAs === 'All' || l.status === filterMarkedAs;
    return matchSearch && matchStatus && matchSource && matchSegment && matchMarkedAs;
  });

  const counts = {
    Unread: leads.filter(l => l.status === 'Unread').length,
    Read: leads.filter(l => l.status === 'Read').length,
    Converted: leads.filter(l => l.status === 'Converted').length,
    Disposed: leads.filter(l => l.status === 'Disposed').length,
  };

  const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
      <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="px-4 py-2 bg-surface border border-border rounded-xl text-xs text-textMain shadow-sm outline-none focus:border-accent transition-all cursor-pointer"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-gray-400 font-semibold animate-pulse">Loading Leads...</div>;

  return (
    <div className="p-5 space-y-5 fade-in">
      {/* Header */}
      <div className="flex justify-between items-start gap-6">
        <div className="flex items-center gap-4">
          <button className="px-8 py-4 bg-accent text-white rounded-[1.25rem] font-black uppercase tracking-widest flex items-center hover:opacity-90 transition-all shadow-lg shadow-accent/25 active:scale-95">
            <UserPlus size={18} className="mr-3" />
            Fresh Pool
          </button>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
            >
              <UserPlus size={14} className="mr-2" />
              Add Leads
            </button>
            <button
              onClick={fetchLeads}
              className="px-4 py-2 bg-surface text-textMuted border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-background transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={12} className="text-primary" /> Refresh
            </button>
          </div>
        </div>
        
        {/* Status summary tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(counts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? 'All' : status)}
              className={`px-5 py-3 rounded-2xl border transition-all flex flex-col items-start gap-1 min-w-[120px] shadow-sm ${
                filterStatus === status 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'bg-surface border-border text-textMain hover:border-accent'
              }`}
            >
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${filterStatus === status ? 'text-white/60' : 'text-textMuted'}`}>{status}</span>
              <span className="text-lg font-black tracking-tight">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reference CRM style 9-filter bar */}
      <div className="bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Quick Action</label>
            <select className="px-4 py-2 bg-background border border-border rounded-xl text-xs text-textMain outline-none focus:border-accent transition-all cursor-pointer">
              <option>Select</option>
            </select>
          </div>
          <FilterSelect label="Marked As" value={filterMarkedAs} onChange={setFilterMarkedAs} options={['All', 'Unread', 'Read', 'Converted', 'Disposed']} />
          <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus} options={STATUSES_ALL} />
          <FilterSelect label="By Date" value="All" onChange={()=>{}} options={['All', 'Today', 'Yesterday', 'Last 7 Days']} />
          <FilterSelect label="Manager" value="All" onChange={()=>{}} options={['All', 'Manager A', 'Manager B']} />
          <FilterSelect label="Lead Source" value={filterSource} onChange={setFilterSource} options={SOURCES} />
          <FilterSelect label="Segment" value={filterSegment} onChange={setFilterSegment} options={SEGMENTS} />
        </div>
        
        <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {['Copy', 'Excel', 'CSV', 'PDF', 'Print'].map(btn => (
              <button key={btn} className="px-4 py-2 bg-background border border-border rounded-xl text-[10px] font-black text-textMuted hover:bg-surface hover:text-accent transition-all uppercase tracking-widest shadow-sm active:scale-95">
                {btn}
              </button>
            ))}
            <div className="flex items-center gap-3 ml-4">
              <select className="px-3 py-1.5 bg-background border border-border rounded-xl text-[10px] font-black text-textMuted outline-none focus:border-accent transition-all cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-[10px] text-textMuted font-black uppercase tracking-widest">records per page</span>
            </div>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search prospects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all shadow-sm text-textMain placeholder:text-textMuted/40"
            />
          </div>
        </div>
      </div>

      {/* Leads Table — exact reference CRM columns */}
      <div className="bg-surface rounded-[2.5rem] border border-border shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border">
                <th className="px-6 py-5 text-[11px] font-black text-textMuted uppercase tracking-[0.2em] pl-8">Prospect Details</th>
                <th className="px-3 py-5 text-[11px] font-black text-textMuted uppercase tracking-[0.2em]">Contact Node</th>
                <th className="px-3 py-5 text-[11px] font-black text-textMuted uppercase tracking-[0.2em]">Live Status</th>
                <th className="px-3 py-5 text-[11px] font-black text-textMuted uppercase tracking-[0.2em]">Owner</th>
                <th className="px-3 py-5 text-[11px] font-black text-textMuted uppercase tracking-[0.2em] text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((lead, index) => (
                <tr key={lead._id || index} className="hover:bg-background transition-all group border-b border-border/40 last:border-0 cursor-default">
                  <td className="px-6 py-5 pl-8">
                    <div className="flex flex-col">
                      <span className="font-black text-textMain tracking-tight text-sm group-hover:text-accent transition-colors">{lead.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-textMuted font-black uppercase tracking-widest bg-background px-2 py-0.5 rounded-lg border border-border/50">{lead.source}</span>
                        <span className="text-[10px] text-accent font-black uppercase tracking-widest">{lead.segment}</span>
                      </div>
                      <span className="text-[10px] text-textMuted mt-1.5 font-medium italic opacity-60">{new Date(lead.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="px-3 py-5">
                    <div className="font-black text-textMain text-xs tracking-wider mb-1">{lead.phone}</div>
                    <button onClick={() => navigate('/dashboard/calls')} className="px-3 py-1 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-accent hover:text-white transition-all">Dial Terminal</button>
                  </td>
                  <td className="px-3 py-5">
                    <span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-[0.15em] border ${
                      lead.status === 'Unread' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-3 py-5">
                     <div className="flex items-center gap-2 font-black text-[10px] text-textMuted uppercase tracking-widest">
                       <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] border border-primary/20">{(lead.assignedToName || 'A').charAt(0)}</div>
                       {lead.assignedToName || (isAdmin ? 'Admin' : 'Me')}
                     </div>
                  </td>
                  <td className="px-3 py-5 text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => handleSO(lead)} 
                        className="bg-accent text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-accent/20 hover:scale-105 active:scale-95"
                       >
                         SO
                       </button>
                       <button 
                         onClick={() => handleFT(lead)} 
                         className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-primary/10 hover:bg-primary hover:text-white active:scale-95"
                       >
                         FT
                       </button>
                       <div className="relative group/more">
                         <button className="p-2.5 hover:bg-background rounded-xl transition-all text-textMuted border border-transparent hover:border-border">
                           <MoreHorizontal size={16} />
                         </button>
                         <div className="hidden group-hover/more:block absolute right-0 top-full mt-2 bg-surface border border-border shadow-2xl rounded-2xl p-1.5 z-[50] min-w-[150px] animate-in fade-in slide-in-from-top-2 duration-200">
                           <button onClick={() => setSelectedLead(lead)} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-textMain hover:bg-background rounded-xl transition-all flex items-center gap-2">
                             <Eye size={12} className="text-accent" /> Detail View
                           </button>
                           <button onClick={() => handleUpdateStatus(lead._id, 'Disposed')} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-textMain hover:bg-background rounded-xl transition-all flex items-center gap-2">
                             <XCircle size={12} className="text-amber-500" /> Archive Lead
                           </button>
                           <div className="h-px bg-border my-1 mx-2"></div>
                           <button onClick={() => handleDeleteLead(lead._id)} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2">
                             <Trash2 size={12} /> Purge System
                           </button>
                         </div>
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-background/30 border-t border-border flex items-center justify-between text-[10px] font-black text-textMuted uppercase tracking-widest">
          <span>Active Dataset Scope: {filtered.length} / {leads.length} Records Detected</span>
          <div className="flex gap-2">
             <span className="opacity-40 italic">System Optimized for High Throughput</span>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-surface rounded-[2.5rem] w-full max-w-xl p-10 shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-textMain tracking-tighter uppercase italic">Lead Acquisition</h3>
                <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Injecting new data node into the prospect pool</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-background rounded-full text-textMuted transition-colors"><XCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleAddLead} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Full Identity *</label>
                  <input required type="text" value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Mobile Uplink *</label>
                  <input required type="text" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Digital Mail</label>
                  <input type="email" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm" placeholder="optional" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Organization</label>
                  <input type="text" value={newLead.company} onChange={e => setNewLead({ ...newLead, company: e.target.value })}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm" placeholder="optional" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Data Source</label>
                  <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm cursor-pointer">
                    {SOURCES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Pool Segment</label>
                  <select value={newLead.segment} onChange={e => setNewLead({ ...newLead, segment: e.target.value })}
                    className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm cursor-pointer">
                    {SEGMENTS.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Context / Notes</label>
                <textarea value={newLead.notes} onChange={e => setNewLead({ ...newLead, notes: e.target.value })} rows={3}
                  className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm resize-none"
                  placeholder="Additional intelligence..." />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-textMuted hover:bg-background rounded-2xl transition-all">Abort</button>
                <button type="submit" className="px-8 py-3 text-xs font-black uppercase tracking-widest text-white bg-accent hover:opacity-90 rounded-2xl shadow-lg shadow-accent/25 transition-all active:scale-95">Commit Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes/Timeline Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-surface rounded-[2.5rem] w-full max-w-lg p-10 shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-accent/20"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-black text-xs border border-accent/20">{selectedLead.name.charAt(0)}</div>
                   <h3 className="text-2xl font-black text-textMain tracking-tighter uppercase italic">{selectedLead.name}</h3>
                </div>
                <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] ml-11">{selectedLead.phone} • {selectedLead.source}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-background rounded-full text-textMuted transition-colors"><XCircle size={24} /></button>
            </div>

            <div className="flex gap-2 mb-8 ml-11">
               <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest">{selectedLead.status}</span>
               <span className="px-3 py-1 rounded-full bg-background border border-border text-textMuted text-[9px] font-black uppercase tracking-widest">{selectedLead.segment}</span>
            </div>

            <div className="bg-background rounded-3xl p-6 border border-border/50 relative group">
              <p className="text-[9px] font-black text-textMuted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <BookOpen size={12} className="text-accent" /> Intelligence Node
              </p>
              <p className="text-sm text-textMain leading-relaxed font-bold">
                {selectedLead.notes || <span className="italic text-textMuted/40 font-normal">Initial observation logs are empty for this prospect.</span>}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between ml-2">
              <p className="text-[9px] text-textMuted font-black uppercase tracking-[0.2em]">Deployment Timestamp: {new Date(selectedLead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <button onClick={() => setSelectedLead(null)} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-textMain bg-background hover:bg-border/20 border border-border rounded-2xl transition-all active:scale-95">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
