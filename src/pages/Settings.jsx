import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe, Moon, Sun, UserPlus, Users, Trash2, Key, Info } from 'lucide-react';
import api from '../api/api';
import { getRoles, addRole, deleteRole as deleteRoleUtil, saveRoles } from '../utils/roleManager';

const Settings = ({ isDarkMode, setIsDarkMode }) => {
  const [notifications, setNotifications] = useState(true);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('site_api_url') || 'http://127.0.0.1:5000/api');
  const [teamTarget, setTeamTarget] = useState(1600000);
  const [updating, setUpdating] = useState(false);
  const [associates, setAssociates] = useState([]);
  const [roles, setRoles] = useState(getRoles());
  const [newAssoc, setNewAssoc] = useState({ name: '', email: '', password: '', sipExtension: '10x', role: roles[0]?.id || 'business_associate' });
  const [loadingAssocs, setLoadingAssocs] = useState(false);
  
  // Role Creation State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState({ label: '', color: 'blue', description: '' });

  useEffect(() => {
    fetchTarget();
    fetchAssociates();
  }, []);

  const fetchTarget = async () => {
    try {
      const res = await api.get('/admin/target');
      setTeamTarget(res.data.target);
    } catch (err) {
      console.error('Failed to fetch target', err);
    }
  };

  const fetchAssociates = async () => {
    setLoadingAssocs(true);
    try {
      const res = await api.get('/auth/associates');
      setAssociates(res.data);
    } catch (err) {
      console.error('Failed to fetch associates', err);
    } finally {
      setLoadingAssocs(false);
    }
  };

  const handleUpdateTarget = async () => {
    setUpdating(true);
    try {
      await api.post('/admin/target', { target: teamTarget });
      alert('Team Target Authorized and Updated');
    } catch (err) {
      alert('Failed to update target protocol');
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateAssociate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', newAssoc);
      setNewAssoc({ name: '', email: '', password: '', sipExtension: '10x', role: roles[0]?.id || 'business_associate' });
      fetchAssociates();
      alert('New Account Provisioned Successfully');
    } catch (err) {
      alert('Failed to provision new account');
    }
  };

  const handleDeleteAssociate = async (id) => {
    if (!window.confirm('Are you sure you want to de-provision this account?')) return;
    try {
      await api.delete(`/auth/associates/${id}`);
      fetchAssociates();
    } catch (err) {
      alert('Failed to remove account');
    }
  };

  const handleAddRoleSpec = () => {
    if (!newRole.label) return;
    const updated = addRole(newRole);
    setRoles(updated);
    setNewRole({ label: '', color: 'blue', description: '' });
    setShowRoleModal(false);
    alert('System Role Integrity Verified and Added');
  };

  const handleDeleteRoleSpec = (id) => {
    if (['admin', 'business_associate', 'team_leader'].includes(id)) {
      alert('Default Protocol Roles are Protected');
      return;
    }
    if (!window.confirm('Purge this role from system protocols?')) return;
    const updated = deleteRoleUtil(id);
    setRoles(updated);
  };

  const handleSaveApiUrl = () => {
    localStorage.setItem('site_api_url', apiUrl);
    window.location.reload(); // Reload to apply the new API URL
  };

  return (
    <div className="p-8 space-y-10 fade-in flex-1 overflow-y-auto bg-background text-textMain transition-colors duration-300 custom-scrollbar">
      <div className="border-b border-border pb-8">
        <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase italic">Control Terminal</h2>
        <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Configure workspace environment and SIP uplink parameters</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Appearance and Alerts Column */}
        <div className="space-y-8">
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

          <div className="p-8 space-y-8 rounded-[2.5rem] border transition-all duration-300 bg-surface border-border shadow-sm group">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black flex items-center text-textMuted uppercase tracking-[0.2em] transition-colors duration-300">
                    <Shield size={16} className="mr-3 text-red-500" />
                    Target configuration
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-black text-textMain tracking-tight">Active Team Target</p>
                  <p className="text-[10px] text-textMuted font-medium uppercase tracking-widest mt-0.5 opacity-60">Total revenue benchmark for current fiscal cycle</p>
                </div>
                
                <div className="relative group/input">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-textMuted/40 font-black text-lg group-focus-within/input:text-primary transition-colors italic">Rs.</span>
                  <input 
                    type="number" 
                    value={teamTarget}
                    onChange={(e) => setTeamTarget(e.target.value)}
                    placeholder="Enter target amount"
                    className="w-full bg-background border border-border rounded-2xl pl-16 pr-6 py-5 text-2xl font-black italic tracking-tighter outline-none focus:border-primary transition-all shadow-inner"
                  />
                </div>

                <button 
                  onClick={handleUpdateTarget}
                  disabled={updating}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/25 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                  {updating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Shield size={16} />
                      Authorize Target Change
                    </>
                  )}
                </button>
              </div>
          </div>
        </div>

        {/* Member Provisioning Form Column */}
        <div className="xl:col-span-2 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Member Form */}
            <div className="p-8 space-y-8 rounded-[2.5rem] border transition-all duration-300 bg-surface border-border shadow-sm group">
              <h3 className="text-[10px] font-black flex items-center text-textMuted uppercase tracking-[0.2em] transition-colors duration-300">
                <UserPlus size={16} className="mr-3 text-primary" />
                Launch Provisioning
              </h3>
              
              <form onSubmit={handleCreateAssociate} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Entity Name</label>
                  <input required type="text" value={newAssoc.name} onChange={e => setNewAssoc({...newAssoc, name: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-xs" placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Digital Identity (Username)</label>
                  <input required type="text" value={newAssoc.email} onChange={e => setNewAssoc({...newAssoc, email: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-xs" placeholder="user_amigo" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Access Cipher (Password)</label>
                  <input required type="password" value={newAssoc.password} onChange={e => setNewAssoc({...newAssoc, password: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-xs" placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">SIP Ext.</label>
                    <input required type="text" value={newAssoc.sipExtension} onChange={e => setNewAssoc({...newAssoc, sipExtension: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-xs" placeholder="10x" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Role Protocol</label>
                    <select value={newAssoc.role} onChange={e => setNewAssoc({...newAssoc, role: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-xs cursor-pointer capitalize">
                      {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/25 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <UserPlus size={16} /> Add Member Node
                </button>
              </form>
            </div>

            {/* Member Snapshot List */}
            <div className="p-8 space-y-6 rounded-[2.5rem] border transition-all duration-300 bg-surface border-border shadow-sm flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black flex items-center text-textMuted uppercase tracking-[0.2em]">
                  <Users size={16} className="mr-3 text-accent" />
                  Member Hierarchy
                </h3>
                <span className="text-[9px] font-black px-2 py-1 bg-background border border-border rounded-lg text-textMuted uppercase italic">{associates.length} Active</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-[300px]">
                {loadingAssocs ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-20">
                    <div className="w-8 h-8 border-2 border-primary border-t-white rounded-full animate-spin"></div>
                    <p className="text-[9px] font-black uppercase tracking-widest">Scanning Nodes...</p>
                  </div>
                ) : (
                  associates.map((assoc) => (
                    <div key={assoc._id} className="p-4 rounded-2xl bg-background border border-border flex items-center justify-between group hover:border-accent/40 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-xs uppercase shadow-inner">
                          {assoc.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-textMain tracking-tight">{assoc.name}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[8px] font-black uppercase text-accent tracking-tighter italic">{roles.find(r => r.id === assoc.role)?.label || assoc.role}</span>
                             <span className="text-[8px] text-textMuted">•</span>
                             <span className="text-[8px] font-bold text-textMuted tabular-nums">EXT: {assoc.sipExtension}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteAssociate(assoc._id)}
                        className="p-2 text-textMuted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                        title="De-provision access"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-5 mt-4 rounded-2xl bg-primary/5 border border-primary/10 border-dashed">
                <div className="flex gap-3">
                    <Info size={14} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-[9px] text-textMuted font-medium leading-relaxed italic uppercase">
                        All member nodes are encrypted within the local SIP cluster. De-provisioning is irreversible across current session instances.
                    </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Role Registry Section */}
          <div className="p-8 space-y-8 rounded-[2.5rem] border transition-all duration-300 bg-surface border-border shadow-sm group">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black flex items-center text-textMuted uppercase tracking-[0.2em]">
                  <Shield size={16} className="mr-3 text-purple-500" />
                  Status Protocols (Roles)
                </h3>
                <button 
                  onClick={() => setShowRoleModal(true)}
                  className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  Define New Role
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map(role => (
                   <div key={role.id} className="p-5 rounded-2xl bg-background border border-border flex flex-col justify-between group/role relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full ${
                         role.color === 'purple' ? 'bg-purple-500' :
                         role.color === 'amber' ? 'bg-amber-500' :
                         role.color === 'emerald' ? 'bg-emerald-500' :
                         role.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-[10px] font-black text-textMain uppercase tracking-[0.05em]">{role.label}</p>
                            <p className="text-[8px] text-textMuted font-medium uppercase tracking-tighter italic opacity-40">{role.id}</p>
                         </div>
                         {!['admin', 'business_associate', 'team_leader'].includes(role.id) && (
                            <button 
                              onClick={() => handleDeleteRoleSpec(role.id)}
                              className="text-textMuted hover:text-red-500 opacity-0 group-hover/role:opacity-100 transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Role Creation Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 animate-in zoom-in-95 duration-300">
           <div className="bg-surface rounded-[2.5rem] w-full max-w-md shadow-2xl border border-border p-10 space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-textMain tracking-tighter uppercase italic">Define System Role</h3>
                 <button onClick={() => setShowRoleModal(false)} className="text-textMuted hover:text-textMain"><Info size={20}/></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Role Label</label>
                    <input type="text" value={newRole.label} onChange={e => setNewRole({...newRole, label: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-xs" placeholder="e.g. Senior Manager" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Spectral Signature (Color)</label>
                    <div className="flex gap-3 pt-1">
                       {['blue', 'purple', 'amber', 'emerald', 'red'].map(c => (
                         <button key={c} onClick={() => setNewRole({...newRole, color: c})} className={`w-8 h-8 rounded-lg transition-transform ${c === 'blue' ? 'bg-blue-500' : c === 'purple' ? 'bg-purple-500' : c === 'amber' ? 'bg-amber-500' : c === 'emerald' ? 'bg-emerald-500' : 'bg-red-500'} ${newRole.color === c ? 'scale-125 ring-2 ring-white shadow-lg shadow-black/20' : 'opacity-40 hover:opacity-100 hover:scale-110'}`}></button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Protocol Description</label>
                    <textarea value={newRole.description} onChange={e => setNewRole({...newRole, description: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-xs resize-none h-20" placeholder="Define role boundaries..."></textarea>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setShowRoleModal(false)} className="flex-1 py-3 border border-border rounded-xl font-black text-textMuted uppercase tracking-widest text-[10px]">Cancel</button>
                 <button onClick={handleAddRoleSpec} className="flex-1 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Authorize Role</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
