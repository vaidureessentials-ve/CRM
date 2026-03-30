import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe, Moon, Sun } from 'lucide-react';

const Settings = ({ isDarkMode, setIsDarkMode }) => {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-8 space-y-10 fade-in flex-1 overflow-y-auto bg-background text-textMain transition-colors duration-300">
      <div className="border-b border-border pb-8">
        <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase italic">Control Terminal</h2>
        <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Configure workspace environment and SIP uplink parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-8 space-y-6 rounded-[2.5rem] border transition-all duration-300 bg-surface border-border shadow-sm group">
              <h3 className="text-[10px] font-black flex items-center text-textMuted uppercase tracking-[0.2em] transition-colors duration-300">
                  <Globe size={16} className="mr-3 text-accent" />
                  Appearance Protocol
              </h3>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-black text-textMain tracking-tight">Interface Theme</p>
                  <p className="text-[10px] text-textMuted font-medium uppercase tracking-widest mt-0.5 opacity-60">Toggle between Light and Dark spectrums</p>
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-14 h-7 rounded-full transition-all relative ${isDarkMode ? 'bg-accent shadow-lg shadow-accent/25' : 'bg-border'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md ${isDarkMode ? 'left-8' : 'left-1'}`}></div>
                </button>
              </div>
          </div>

          <div className="p-8 space-y-6 rounded-[2.5rem] border transition-all duration-300 bg-surface border-border shadow-sm group">
              <h3 className="text-[10px] font-black flex items-center text-textMuted uppercase tracking-[0.2em] transition-colors duration-300">
                  <Bell size={16} className="mr-3 text-primary" />
                  Alert Diagnostics
              </h3>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-black text-textMain tracking-tight">Uplink Notifications</p>
                  <p className="text-[10px] text-textMuted font-medium uppercase tracking-widest mt-0.5 opacity-60">Push alerts for incoming SIP traffic</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-7 rounded-full transition-all relative ${notifications ? 'bg-primary shadow-lg shadow-primary/25' : 'bg-border'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md ${notifications ? 'left-8' : 'left-1'}`}></div>
                </button>
              </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 space-y-6 rounded-[2.5rem] border transition-all duration-300 bg-surface border-border shadow-sm group">
              <h3 className="text-[10px] font-black flex items-center text-textMuted uppercase tracking-[0.2em] transition-colors duration-300">
                  <Shield size={16} className="mr-3 text-red-500" />
                  Security Protocol
              </h3>
              <div className="space-y-4">
                  <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl transition-all">
                      <p className="text-[11px] leading-relaxed font-bold text-red-500/80 uppercase tracking-wider italic">
                          Security mandate: SIP credentials must remain local. Utilize WSS (Secure WebSockets) for all encrypted VOIP endpoints.
                      </p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
