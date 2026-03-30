import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Phone, Users, Edit2, Trash2, Eye, CreditCard, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SipPhone from '../components/SipPhone';

const Clients = ({ user, associates }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', company: '' });
  const [activeCall, setActiveCall] = useState(null);
  const [viewMode, setViewMode] = useState('mine'); // 'mine' or 'all'

  useEffect(() => {
    fetchClients();
  }, [user, viewMode]);

  const fetchClients = async () => {
    try {
      const res = await api.get(`/clients?view=${viewMode}`);
      setClients(res.data);
    } catch (err) {
      console.error('Failed to fetch clients', err);
      setClients([]);
    }
  };

  const handleSaveClient = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
          await api.put(`/clients/${editingClient._id}`, newClient);
      } else {
          await api.post('/clients', newClient);
      }
      fetchClients();
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save client');
    }
  };

  const handleEditClick = (client) => {
    setEditingClient(client);
    setNewClient({ name: client.name, phone: client.phone, email: client.email || '', company: client.company || '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setNewClient({ name: '', phone: '', email: '', company: '' });
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Are you sure you want to remove this client?')) return;
    try {
      await api.delete(`/clients/${id}`);
      fetchClients();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete client');
    }
  };

  const initiateCall = (client) => {
    setActiveCall(client);
  };

  return (
    <div className="p-8 h-full flex flex-col fade-in bg-background text-textMain transition-colors duration-300">
      <div className="flex justify-between items-end mb-10 border-b border-border pb-8">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase">Client Directory</h2>
            <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Managed database of verified status nodes</p>
          </div>
          {user?.role === 'admin' && (
            <div className="flex bg-surface p-1.5 rounded-2xl border border-border ml-4 shadow-sm">
              <button 
                onClick={() => setViewMode('mine')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'mine' ? 'bg-background shadow-lg text-accent border border-border/50' : 'text-textMuted hover:text-textMain'}`}
              >
                Personal
              </button>
              <button 
                onClick={() => setViewMode('all')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'all' ? 'bg-background shadow-lg text-accent border border-border/50' : 'text-textMuted hover:text-textMain'}`}
              >
                Global
              </button>
            </div>
          )}
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-accent text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest flex items-center hover:opacity-90 transition-all shadow-lg shadow-accent/25 active:scale-95"
        >
          <Plus size={18} className="mr-3" />
          Add Client
        </button>
      </div>

      <div className="flex-1 bg-surface rounded-[2.5rem] border border-border overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 text-[11px] font-black text-textMuted uppercase tracking-[0.2em] border-b border-border">
                <th className="px-6 py-5 pl-8">Identity & Comm Path</th>
                <th className="px-4 py-5 font-black">Organization</th>
                <th className="px-4 py-5 font-black">Uplink Code</th>
                <th className="px-4 py-5 font-black">Intelligence</th>
                <th className="px-4 py-5 font-black">Live Status</th>
                <th className="px-4 py-5 font-black text-right pr-8">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {clients.map(client => (
                <tr key={client._id || client.id || Math.random()} className="hover:bg-background transition-all group cursor-default">
                  <td className="px-6 py-5 font-black text-textMain pl-8">
                    <div className="text-sm tracking-tight group-hover:text-accent transition-colors">{client.name}</div>
                    <div className="text-[10px] text-textMuted font-medium uppercase tracking-widest mt-0.5">{client.email || 'No digital trail'}</div>
                  </td>
                  <td className="px-4 py-5 text-textMuted font-bold uppercase tracking-widest text-[10px]">{client.company || '-'}</td>
                  <td className="px-4 py-5 text-textMain font-black text-xs tracking-wider">{client.phone}</td>
                  <td className="px-4 py-5">
                    <div className="max-w-[150px] truncate text-[10px] text-textMuted font-medium opacity-60" title={client.notes}>
                        {client.notes || 'No logs detected'}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className="px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] rounded-full bg-accent/10 text-accent border border-accent/20">
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-right space-x-2 pr-8">
                    <Link 
                      to={`/dashboard/clients/${client._id}`}
                      className="p-2.5 text-textMuted bg-background border border-border rounded-xl transition-all hover:text-accent hover:border-accent inline-flex items-center shadow-sm"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                    <button 
                      onClick={() => navigate('/dashboard/salesorder', { state: { clientId: client._id } })}
                      className="p-2.5 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all hover:bg-emerald-500 hover:text-white inline-flex items-center shadow-sm"
                      title="Create Sales Order"
                    >
                      <CreditCard size={16} />
                    </button>
                    <button 
                      onClick={() => initiateCall(client)}
                      className="p-2.5 text-primary bg-primary/10 border border-primary/20 rounded-xl transition-all hover:bg-primary hover:text-white inline-flex items-center shadow-sm"
                      title="Call via WebRTC"
                    >
                      <Phone size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <Users size={32} className="text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-900">No clients found</p>
                      <p className="text-sm mt-1">Click "Add Client" to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-surface rounded-[2.5rem] w-full max-w-lg p-10 shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-textMain tracking-tighter uppercase">{editingClient ? 'Recalibrate Node' : 'Initialize Client'}</h3>
                <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Updating high-priority database entries</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-background rounded-full text-textMuted transition-colors"><XCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveClient} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Identity Tag</label>
                <input required type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} 
                  className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm" placeholder="Full Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">SIP Uplink</label>
                <input required type="text" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} 
                  className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm" placeholder="e.g. 102" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Organization Node</label>
                <input type="text" value={newClient.company} onChange={e => setNewClient({...newClient, company: e.target.value})} 
                  className="w-full px-5 py-3 bg-background border border-border rounded-2xl text-sm focus:border-accent outline-none text-textMain transition-all shadow-sm" placeholder="Company Name" />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-textMuted hover:bg-background rounded-2xl transition-all">Abort</button>
                <button type="submit" className="px-8 py-3 text-xs font-black uppercase tracking-widest text-white bg-primary hover:opacity-90 rounded-2xl shadow-lg shadow-primary/25 transition-all active:scale-95">Commit Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeCall && (
        <SipPhone client={activeCall} onClose={() => setActiveCall(null)} />
      )}
    </div>
  );
};

export default Clients;
