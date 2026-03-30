import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
  Shield, Users, Activity, ExternalLink, UserPlus, 
  Settings, Database, List, CheckCircle, AlertCircle
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [associates, setAssociates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAssoc, setEditingAssoc] = useState(null);
  const [newAssoc, setNewAssoc] = useState({ name: '', email: '', password: '', sipExtension: '10x', role: 'associate' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);

    try {
      if (activeTab === 'users') {
        const res = await api.get('/auth/associates');
        setAssociates(res.data);
      } else if (activeTab === 'logs') {
        const res = await api.get('/admin/logs');
        setLogs(res.data);
      } else if (activeTab === 'system') {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssociate = async (e) => {
    e.preventDefault();
    try {
      if (editingAssoc) {
        await api.put(`/auth/${editingAssoc._id}`, newAssoc);
      } else {
        await api.post('/auth/register', newAssoc);
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save associate');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAssoc(null);
    setNewAssoc({ name: '', email: '', password: '', sipExtension: '10x', role: 'associate' });
  };

  const handleImportLeads = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await api.post('/admin/import-leads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to import leads');
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = {
    auth: 'text-blue-600 bg-blue-50',
    lead: 'text-emerald-600 bg-emerald-50',
    system: 'text-purple-600 bg-purple-50',
    client: 'text-amber-600 bg-amber-50',
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System Analytics', icon: Activity },
    { id: 'leads', label: 'Lead Controls', icon: Database },
    { id: 'logs', label: 'Activity Logs', icon: List },
  ];

  return (
    <div className="p-8 space-y-8 fade-in bg-background text-textMain transition-colors duration-300 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase italic flex items-center">
            <Shield className="mr-4 text-primary" size={32} />
            Command Center
          </h2>
          <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">High-level administrative override and system orchestration</p>
        </div>
        {activeTab === 'users' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/25 flex items-center hover:opacity-90 transition-all active:scale-95"
          >
            <UserPlus size={20} className="mr-3" />
            Provision Associate
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex space-x-2 bg-surface p-1.5 rounded-[1.5rem] w-fit border border-border shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-background text-primary shadow-inner border border-border' 
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            <tab.icon size={14} className="mr-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 glass-panel">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="bg-surface rounded-[2.5rem] border border-border overflow-hidden shadow-sm shadow-black/5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background/50 border-b border-border text-textMuted">
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] pl-10">Entity Identity</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em]">Comms Uplink</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em]">Permission Matrix</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center">Nodes Managed</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-right pr-10">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {associates.map(assoc => (
                      <tr key={assoc._id} className="hover:bg-background/80 transition-all group">
                        <td className="px-8 py-6 pl-10">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-sm mr-4 capitalize shadow-inner">
                              {assoc.name.charAt(0)}
                            </div>
                            <span className="font-black text-textMain text-sm tracking-tight group-hover:text-primary transition-colors">{assoc.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-textMuted text-xs font-medium tracking-tight">{assoc.email}</td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                            assoc.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-purple-500/5' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                            {assoc.role}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center font-black text-textMain tracking-tighter text-lg">{assoc.clients?.length || 0}</td>
                        <td className="px-8 py-6 text-right pr-10">
                          <button onClick={() => {
                            setEditingAssoc(assoc);
                            setNewAssoc({ name: assoc.name, email: assoc.email, password: '', sipExtension: assoc.sipExtension, role: assoc.role });
                            setShowModal(true);
                          }} className="text-textMuted hover:text-primary p-2.5 bg-background border border-border rounded-xl shadow-sm transition-all hover:border-primary active:scale-90"><ExternalLink size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SYSTEM ANALYTICS TAB */}
            {activeTab === 'system' && stats && (
              <div className="space-y-8 h-full">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard label="Network Entity Count" value={stats.totalUsers} icon={Users} color="blue" />
                  <StatCard label="Global Data Ingest" value={stats.totalLeads} icon={Database} color="emerald" />
                  <StatCard label="Uplink Verification" value={stats.systemStatus} icon={CheckCircle} color="emerald" />
                  <StatCard label="Session Continuity" value={`${Math.floor(stats.uptime / 3600)}h ${Math.floor((stats.uptime % 3600) / 60)}m`} icon={Activity} color="amber" />
                </div>
                <div className="bg-surface rounded-[2.5rem] border border-border p-10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0">
                      <Activity size={120} />
                   </div>
                   <h3 className="text-2xl font-black text-textMain mb-4 flex items-center tracking-tighter uppercase italic">
                      <Activity size={24} className="mr-4 text-primary"/> 
                      Pulse Diagnostic
                   </h3>
                   <p className="text-sm text-textMuted max-w-2xl font-medium leading-relaxed">
                      Global systems are synchronizing at peak efficiency. Latency across all SIP clusters is within nominal thresholds. Encryption protocols remain verified and active.
                   </p>
                </div>
              </div>
            )}

            {/* LEADS TAB */}
            {activeTab === 'leads' && (
              <div className="bg-surface rounded-[2.5rem] border border-border p-16 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center space-y-10">
                  <div className="p-8 bg-emerald-500/10 rounded-[2rem] text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-pulse">
                    <Database size={64} />
                  </div>
                  <div className="max-w-xl mx-auto space-y-3">
                    <h3 className="text-4xl font-black text-textMain tracking-tighter uppercase italic">XLSX Data Ingest</h3>
                    <p className="text-[10px] text-textMuted font-bold uppercase tracking-[0.2em]">
                      Mass synchronization Protocol for multi-node lead registration
                    </p>
                  </div>

                  <div className="w-full max-w-md p-10 border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center space-y-6 hover:border-primary/50 transition-all bg-background/50 cursor-pointer group">
                    <div className="text-center w-full">
                      <p className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-6 opacity-60">Source File Verification Required</p>
                      <input 
                        type="file" 
                        accept=".xlsx, .xls"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImportLeads(file);
                          }
                        }}
                        className="hidden" 
                        id="lead-upload"
                      />
                      <label 
                        htmlFor="lead-upload"
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/25 cursor-pointer hover:opacity-90 active:scale-95 transition-all inline-flex items-center"
                      >
                        <Database size={20} className="mr-4" />
                        Initialize Upload
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
                    <div className="p-6 bg-background rounded-2xl border border-border text-left shadow-inner">
                      <p className="text-[9px] font-black text-textMuted uppercase tracking-widest mb-2 opacity-40 italic">Mandatory Schema</p>
                      <p className="text-xs font-black text-textMain uppercase tabular-nums">Name, Phone</p>
                    </div>
                    <div className="p-6 bg-background rounded-2xl border border-border text-left shadow-inner">
                      <p className="text-[9px] font-black text-textMuted uppercase tracking-widest mb-2 opacity-40 italic">Metadata Keys</p>
                      <p className="text-xs font-black text-textMain uppercase tabular-nums">Email, Company, Notes, Source, Segment</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LOGS TAB */}
            {activeTab === 'logs' && (
              <div className="bg-surface rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background/50 border-b border-border text-textMuted">
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] pl-10">Temporal Marker</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em]">Operator Identity</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em]">Sequence Action</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-right pr-10">Status Vector</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {logs.length > 0 ? logs.map(log => (
                      <tr key={log._id} className="hover:bg-background/50 transition-colors">
                        <td className="px-8 py-5 pl-10 text-[10px] font-black text-textMuted tabular-nums uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-8 py-5 font-black text-textMain text-xs tracking-tight uppercase italic">{log.user}</td>
                        <td className="px-8 py-5 text-xs text-textMuted font-medium">{log.action || log.details}</td>
                        <td className="px-8 py-5 text-right pr-10">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-current shadow-sm ${
                            log.category === 'auth' ? 'text-blue-500' :
                            log.category === 'lead' ? 'text-emerald-500' :
                            log.category === 'system' ? 'text-purple-500' :
                            'text-amber-500'
                          }`}>
                            {log.category}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-8 py-32 text-center text-textMuted opacity-20">
                           <Activity size={72} className="mx-auto mb-4" />
                           <p className="text-xl font-black uppercase tracking-[0.4em] italic leading-none">Vacuum Detected</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
          <div className="bg-surface rounded-[2.5rem] w-full max-w-xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-border overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-500"></div>
            <div className="px-10 py-8 border-b border-border flex justify-between items-center bg-background/30">
               <div>
                  <h3 className="text-2xl font-black text-textMain tracking-tighter uppercase italic">{editingAssoc ? 'Override Entity' : 'Associate Protocol'}</h3>
                  <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Provisioning new access node for system hierarchy</p>
               </div>
               <button onClick={handleCloseModal} className="text-textMuted hover:text-textMain transition-colors">
                  <AlertCircle size={28} />
               </button>
            </div>

            <form onSubmit={handleSaveAssociate} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Entity Name</label>
                  <input required type="text" value={newAssoc.name} onChange={e => setNewAssoc({...newAssoc, name: e.target.value})} className="w-full px-6 py-4 bg-background border border-border rounded-2xl focus:border-primary outline-none transition-all font-bold text-textMain shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Comm Uplink (Email)</label>
                  <input required type="email" value={newAssoc.email} onChange={e => setNewAssoc({...newAssoc, email: e.target.value})} className="w-full px-6 py-4 bg-background border border-border rounded-2xl focus:border-primary outline-none transition-all font-bold text-textMain shadow-sm" />
                </div>
                {!editingAssoc && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Access Cipher (Password)</label>
                    <input required type="password" value={newAssoc.password} onChange={e => setNewAssoc({...newAssoc, password: e.target.value})} className="w-full px-6 py-4 bg-background border border-border rounded-2xl focus:border-primary outline-none transition-all font-bold text-textMain shadow-sm" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">SIP Extension ID</label>
                  <input required type="text" value={newAssoc.sipExtension} onChange={e => setNewAssoc({...newAssoc, sipExtension: e.target.value})} className="w-full px-6 py-4 bg-background border border-border rounded-2xl focus:border-primary outline-none transition-all font-bold text-textMain shadow-sm" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-4 border border-border rounded-2xl font-black text-textMuted uppercase tracking-widest hover:text-textMain transition-all active:scale-95 text-[10px]">Abort</button>
                <button type="submit" className="flex-[2] py-4 px-8 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/25 hover:opacity-90 active:scale-95 transition-all text-[10px]">
                   {editingAssoc ? 'Update Identity' : 'Launch Provisioning'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-500/5',
    emerald: 'border-emerald-500 bg-emerald-500/5',
    amber: 'border-amber-500 bg-amber-500/5',
  };
  return (
    <div className={`bg-surface p-8 border border-border rounded-[2rem] shadow-sm relative overflow-hidden group transition-all hover:-translate-y-1`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${color === 'blue' ? 'bg-blue-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">{label}</p>
          <p className="text-4xl font-black text-textMain tracking-tighter group-hover:scale-105 transition-transform origin-left">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : color === 'blue' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'} border border-current/20 shadow-inner`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
