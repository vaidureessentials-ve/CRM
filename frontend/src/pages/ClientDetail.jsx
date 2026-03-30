import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { 
  Phone, 
  Mail, 
  Building, 
  Clock, 
  ArrowLeft, 
  User, 
  MoreHorizontal, 
  PhoneCall, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import SipPhone from '../components/SipPhone';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    fetchClientDetail();
  }, [id]);

  const fetchClientDetail = async () => {
    try {
      const res = await api.get(`/clients/${id}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch client details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="animate-pulse text-gray-500 font-bold">Loading client history...</div>
    </div>
  );

  if (error) return (
    <div className="p-8 flex flex-col items-center justify-center h-full text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-gray-900">{error}</h3>
      <button onClick={() => navigate('/dashboard/clients')} className="mt-4 text-primary font-bold flex items-center">
        <ArrowLeft size={16} className="mr-2" /> Back to Clients
      </button>
    </div>
  );

  const { client, logs } = data;

  return (
    <div className="p-8 space-y-10 fade-in h-full overflow-y-auto bg-background text-textMain transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard/clients')}
            className="p-3 bg-surface border border-border rounded-xl transition-all hover:text-primary hover:border-primary active:scale-90 text-textMuted shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-textMain tracking-tighter uppercase italic">Entity Profile</h1>
            <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Full-spectrum interaction forensics and identity data</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveCall(client)}
            className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center shadow-lg shadow-primary/25 hover:opacity-90 transition-all active:scale-95"
          >
            <Phone size={20} className="mr-3" />
            Engage Uplink
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-border p-10 text-center relative overflow-hidden group rounded-[2.5rem] shadow-sm">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent opacity-50"></div>
            <div className="w-24 h-24 bg-background border border-border rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-textMuted group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-inner">
              <User size={40} />
            </div>
            <h2 className="text-3xl font-black text-textMain tracking-tighter">{client.name}</h2>
            <div className="mt-2 text-[10px] font-black tracking-[0.2em] uppercase py-1 px-4 bg-primary/10 text-primary border border-primary/20 rounded-full inline-block">
               {client.status}
            </div>
            
            <div className="mt-10 space-y-5 text-left bg-background/50 p-6 rounded-3xl border border-border/50">
              <div className="flex items-center text-xs font-bold text-textMain uppercase tracking-widest">
                <Phone size={14} className="mr-4 text-primary" />
                <span className="tabular-nums">{client.phone}</span>
              </div>
              <div className="flex items-center text-xs font-bold text-textMain uppercase tracking-widest">
                <Mail size={14} className="mr-4 text-primary" />
                <span className="truncate">{client.email || 'NO_EMAIL_RECORD'}</span>
              </div>
              <div className="flex items-center text-xs font-bold text-textMain uppercase tracking-widest">
                <Building size={14} className="mr-4 text-primary" />
                <span>{client.company || 'INDEPENDENT_NODE'}</span>
              </div>
            </div>

            {client.notes && (
              <div className="mt-8 pt-6 border-t border-border text-left">
                <p className="text-[9px] font-black text-textMuted uppercase tracking-[0.2em] mb-3 opacity-40 italic">Intelligence Memo</p>
                <p className="text-xs text-textMuted font-medium leading-relaxed bg-background p-4 rounded-2xl border border-border/30">
                  {client.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Call Logs */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="px-10 py-6 border-b border-border flex justify-between items-center bg-background/30">
              <h3 className="text-[10px] font-black text-textMain uppercase tracking-[0.2em] flex items-center italic">
                <PhoneCall size={16} className="mr-3 text-primary" />
                Interaction Sequence
              </h3>
              <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full uppercase tracking-widest">
                {logs.length} Logged Events
              </span>
            </div>
            
            <div className="divide-y divide-border/40">
              {logs.map(log => (
                <div key={log._id} className="p-8 hover:bg-background/80 transition-all flex items-start justify-between group cursor-default">
                  <div className="flex gap-6">
                    <div className={`p-4 rounded-2xl border shadow-inner transition-all ${
                      log.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5' : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5'
                    }`}>
                      <PhoneCall size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-black text-textMain tracking-tight uppercase italic">Outgoing Transmission</p>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                          log.status === 'Completed' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-textMuted mt-2 flex items-center gap-4 font-bold uppercase tracking-widest">
                        <span className="flex items-center text-textMain"><Clock size={12} className="mr-2 text-primary" /> {Math.floor(log.duration / 60)}m {log.duration % 60}s</span>
                        <span className="opacity-20">•</span>
                        <span className="flex items-center text-textMain bg-background border border-border px-3 py-0.5 rounded-lg"><User size={10} className="mr-2 text-primary" /> {log.user?.name || 'UNKNOWN_OP'}</span>
                        <span className="opacity-20">•</span>
                        <span className="tabular-nums text-textMuted/60">{new Date(log.createdAt).toLocaleString()}</span>
                      </p>
                      {log.notes && (
                        <div className="mt-4 bg-background border border-border/40 p-5 rounded-2xl text-[11px] text-textMuted font-medium leading-relaxed italic border-l-2 border-l-primary/30">
                          {log.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="p-32 text-center opacity-10 flex flex-col items-center">
                  <MessageSquare size={72} className="mx-auto text-textMuted mb-6" />
                  <p className="text-2xl font-black text-textMain uppercase tracking-[0.4em] italic mb-2">Null Stream</p>
                  <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">No spectral traffic detected for this node</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeCall && (
        <SipPhone client={activeCall} onClose={() => setActiveCall(null)} />
      )}
    </div>
  );
};

export default ClientDetail;
