import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Loader2, Radio } from 'lucide-react';
import api from '../api/api';

const SipPhone = ({ client, onClose }) => {
  const [callState, setCallState] = useState('Connecting...');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const durationInterval = useRef(null);
  const [notes, setNotes] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);

  useEffect(() => {
    // This is a UI simulation of the call state machine
    const outlineTimer = setTimeout(() => {
      setCallState('Ringing...');
      setTimeout(() => {
        setCallState('Connected');
        // Start duration counter
        durationInterval.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      }, 2500);
    }, 1000);

    return () => {
      clearTimeout(outlineTimer);
      if (durationInterval.current) clearInterval(durationInterval.current);
    };
  }, [client]);

  const endCall = () => {
    if (durationInterval.current) clearInterval(durationInterval.current);
    setCallState('Ended');
    setShowLogForm(true);
  };

  const saveCallLog = async () => {
    try {
      await api.post('/calls', {
        client: client._id,
        duration,
        status: duration > 0 ? 'Completed' : 'Missed',
        notes
      });
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    }
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-[100] transition-all p-4">
      <div className="bg-surface rounded-[3rem] w-full max-w-[360px] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden fade-in relative animate-in zoom-in-95 duration-300 border border-border ring-1 ring-white/10">
        
        <div className="bg-background/40 px-6 py-4 border-b border-border flex justify-between items-center text-[9px] font-black tracking-[0.2em] text-textMuted uppercase italic">
          <div className="flex items-center">
            <Radio size={12} className="mr-2 text-primary animate-pulse" />
            <span>Secure Uplink Protocol</span>
          </div>
          {callState === 'Connected' && (
            <span className="text-emerald-500 font-black tracking-widest flex items-center">
              ENCRYPTED
            </span>
          )}
        </div>

        <div className="p-10 flex flex-col items-center text-center">
          <div className="w-28 h-28 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20 rounded-[2.5rem] flex items-center justify-center mb-8 relative border border-white/5 shadow-inner group">
            {callState === 'Connected' && (
               <div className="absolute inset-[-8px] rounded-[3rem] border-2 border-primary/20 animate-ping"></div>
            )}
            <Phone className={`text-primary transition-transform duration-700 ${callState === 'Ringing...' ? 'animate-bounce scale-110' : 'group-hover:scale-125'}`} size={40} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-3xl font-black text-textMain tracking-tighter uppercase italic">{client.name}</h2>
          <p className="text-primary font-black mt-2 text-[10px] tracking-[0.3em] uppercase bg-primary/5 px-6 py-1.5 rounded-full border border-primary/10 shadow-sm tabular-nums">
            {client.phone}
          </p>
          
          {!showLogForm ? (
            <>
              <div className="h-16 mb-10 flex items-center justify-center w-full">
                {callState === 'Connected' ? (
                  <div className="flex flex-col items-center">
                    <p className="text-5xl font-black text-textMain tabular-nums tracking-tighter italic leading-none">{formatDuration(duration)}</p>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-3 animate-pulse">Transmission Active</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-background border border-border px-8 py-3 rounded-2xl shadow-inner">
                    {callState === 'Connecting...' && <Loader2 size={16} className="animate-spin text-primary" />}
                    <span className="text-[10px] font-black text-textMain uppercase tracking-[0.2em] italic">{callState}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center items-center space-x-8 w-full">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={callState !== 'Connected'}
                  className={`p-5 rounded-2xl transition-all border shadow-sm active:scale-90 ${
                    isMuted 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-background border-border text-textMuted hover:border-primary hover:text-primary'
                  } ${callState !== 'Connected' ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} /> }
                </button>
                
                <button 
                  onClick={endCall}
                  className="p-7 rounded-[2rem] bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/40 text-white transition-all transform hover:scale-110 active:scale-95 border border-white/20 ring-4 ring-red-500/10 flex items-center justify-center group"
                >
                  <PhoneOff size={32} className="group-active:rotate-45 transition-transform" />
                </button>

                <button 
                  disabled={callState !== 'Connected'}
                  className={`p-5 rounded-2xl transition-all border border-border bg-background text-textMuted hover:border-primary hover:text-primary shadow-sm active:scale-90 ${callState !== 'Connected' ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                >
                  <Volume2 size={24} />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full text-left animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-background border border-border p-6 rounded-3xl mb-8 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/30"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-textMuted uppercase tracking-[0.3em] opacity-40 italic">Final Call Metrics</span>
                  <span className="text-3xl font-black text-textMain italic tabular-nums tracking-tighter">{formatDuration(duration)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-textMain uppercase tracking-[0.2em] ml-2 italic">Intelligence Log</label>
                <textarea 
                  className="w-full px-6 py-4 bg-background border border-border rounded-[2rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none resize-none text-[11px] font-medium leading-relaxed shadow-sm transition-all text-textMain placeholder:text-textMuted/30 italic"
                  rows="4"
                  placeholder="Summarize the core exchange or next-action nodes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-10 flex flex-col space-y-4">
                <button onClick={saveCallLog} className="w-full py-4 bg-textMain text-background text-[10px] font-black rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-[0.3em] hover:bg-primary hover:text-white border border-border/50">Commit Log Entry</button>
                <button onClick={onClose} className="w-full py-4 text-[9px] font-black text-textMuted hover:text-red-500 transition-colors uppercase tracking-[0.3em] italic">Purge Buffer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SipPhone;
