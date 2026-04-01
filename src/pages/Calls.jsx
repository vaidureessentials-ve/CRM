import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Phone, PhoneMissed, PhoneOutgoing, Clock } from 'lucide-react';

const Calls = ({ user, associates }) => {
  const [calls, setCalls] = useState([]);
  const [viewMode, setViewMode] = useState('mine');
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    fetchCalls();
  }, [user, viewMode]);

  const fetchCalls = async () => {
    try {
      const res = await api.get(`/calls?view=${viewMode}`);
      setCalls(res.data);
    } catch (err) {
      console.error('Failed to fetch call logs', err);
      setCalls([]);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <Phone className="text-emerald-500" size={18} />;
      case 'Missed': return <PhoneMissed className="text-red-500" size={18} />;
      case 'Failed': return <PhoneMissed className="text-gray-400" size={18} />;
      default: return <PhoneOutgoing className="text-blue-500" size={18} />;
    }
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="p-8 h-full flex flex-col fade-in bg-background text-textMain transition-colors duration-300">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-8">
        <div>
          <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase italic">Comm Ledger</h2>
          <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">High-fidelity SIP traffic logs and temporal analytics</p>
        </div>
        {user?.role === 'admin' && (
          <div className="flex bg-surface p-1.5 rounded-2xl border border-border shadow-sm">
            <button 
              onClick={() => setViewMode('mine')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'mine' ? 'bg-background text-primary shadow-inner border border-border' : 'text-textMuted hover:text-textMain'}`}
            >
              Operator Log
            </button>
            <button 
              onClick={() => setViewMode('all')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'all' ? 'bg-background text-primary shadow-inner border border-border' : 'text-textMuted hover:text-textMain'}`}
            >
              Master Ingest
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 bg-surface rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="overflow-y-auto h-full pr-1">
          <ul className="divide-y divide-border/40">
            {calls.map((call) => (
              <li key={call._id} className="p-8 hover:bg-background/80 transition-all flex items-center justify-between group cursor-default">
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-2xl border shadow-inner transition-all ${
                    call.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {getStatusIcon(call.status)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-textMuted uppercase tracking-widest opacity-40 mb-1">Entity Reference</p>
                    <p className="text-sm font-black text-textMain tracking-tight group-hover:text-primary transition-colors">{call.client?.name || 'Unknown Node'}</p>
                    <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest mt-0.5">{call.client?.phone || 'NO_IDENT'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-12">
                  <div className="flex items-center space-x-4">
                    {call.recordingUrl && (
                      <button 
                        onClick={() => setPlayingId(playingId === call._id ? null : call._id)}
                        className={`p-3 rounded-xl border transition-all ${
                          playingId === call._id ? 'bg-primary text-white border-primary' : 'bg-background text-primary border-border hover:border-primary'
                        }`}
                        title={playingId === call._id ? "Close Audio" : "Listen to Recording"}
                      >
                        <Phone size={14} className={playingId === call._id ? "animate-pulse" : ""} />
                      </button>
                    )}
                    <div className="text-right">
                      <p className="text-[10px] font-black text-textMuted uppercase tracking-widest opacity-40 mb-1 italic">Temporal Shift</p>
                      <p className="text-sm font-black text-textMain flex items-center justify-end tracking-tighter">
                        <Clock size={14} className="mr-2 text-textMuted" />
                        {formatDuration(call.duration)}
                      </p>
                      <p className="text-[9px] text-textMuted font-black uppercase tracking-widest mt-1 tabular-nums">
                        {new Date(call.createdAt).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="w-28 text-right">
                     <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border shadow-sm transition-all ${
                       call.status === 'Completed' 
                         ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5' 
                         : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5'
                     }`}>
                       {call.status}
                     </span>
                  </div>
                </div>
                {playingId === call._id && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
                    <audio 
                      src={`${api.defaults.baseURL.replace('/api', '')}${call.recordingUrl}`} 
                      controls 
                      autoPlay 
                      className="flex-1 h-8"
                    />
                    <button onClick={() => setPlayingId(null)} className="text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-red-500">Close</button>
                  </div>
                )}
              </li>
            ))}
            {calls.length === 0 && (
              <li className="p-32 text-center flex flex-col items-center opacity-10">
                <div className="bg-background p-10 rounded-[2rem] border border-border shadow-inner mb-6">
                  <Phone className="text-textMuted" size={72} />
                </div>
                <p className="text-2xl font-black text-textMain uppercase tracking-[0.4em] italic mb-2">Silent Frequency</p>
                <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">No spectral traffic detected in this interval</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calls;
