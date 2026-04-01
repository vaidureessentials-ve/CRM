import React, { useState } from 'react';
import { 
  Plus, Inbox, Star, Send, File, Trash2, 
  Search, Filter, MoreVertical, Paperclip, 
  ChevronLeft, ChevronRight, X
} from 'lucide-react';

const MOCK_EMAILS = [];

const Mailbox = () => {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const folderItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'sent', label: 'Sent Mail', icon: Send },
    { id: 'drafts', label: 'Drafts', icon: File },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  const filteredEmails = emails.filter(email => {
    const matchesFolder = activeFolder === 'starred' ? email.starred : email.folder === activeFolder;
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.from.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const toggleStar = (id) => {
    setEmails(emails.map(e => e.id === id ? { ...e, starred: !e.starred } : e));
  };

  const deleteEmail = (id) => {
    setEmails(emails.filter(e => e.id !== id));
    if (selectedEmail?.id === id) setSelectedEmail(null);
  };

  return (
    <div className="h-full flex flex-col bg-surface/30 rounded-[2.5rem] border border-border overflow-hidden transition-all duration-500 shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-border bg-background/50 flex flex-col pt-8 p-4 shrink-0 overflow-y-auto">
          <button 
            onClick={() => setShowCompose(true)}
            className="w-full mb-8 bg-accent text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all outline-none"
          >
            <Plus size={16} className="mr-2" /> Compose
          </button>

          <div className="space-y-1.5 px-2">
            {folderItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveFolder(item.id); setSelectedEmail(null); }}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                  activeFolder === item.id 
                    ? 'bg-accent/10 border-accent/20 text-accent translate-x-1' 
                    : 'text-textMuted border-transparent hover:bg-background hover:text-textMain'
                }`}
              >
                <item.icon size={14} className="mr-3 opacity-60" />
                {item.label}
                {item.id === 'inbox' && (
                  <span className="ml-auto bg-accent text-white px-2 py-0.5 rounded-lg text-[8px] font-black tabular-nums shadow-sm">
                    {emails.filter(e => e.folder === 'inbox' && !e.read).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* List & Detail Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/20 relative">
          {/* Controls Bar */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-surface/5 backdrop-blur-sm sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-sm group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search internal communications..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-background border border-border rounded-xl text-[11px] font-black text-boltBlack outline-none focus:border-accent transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-background border border-border rounded-xl px-2 py-1 shadow-inner text-boltBlack/40">
                <button className="p-1.5 hover:text-accent transition-colors"><ChevronLeft size={16}/></button>
                <span className="text-[10px] font-black px-2 uppercase tracking-tighter">1-10 of 82</span>
                <button className="p-1.5 hover:text-accent transition-colors"><ChevronRight size={16}/></button>
              </div>
              <button className="p-2.5 bg-background border border-border rounded-xl text-textMuted hover:text-accent transition-all shadow-sm"><Filter size={16}/></button>
            </div>
          </div>

          {/* List Scroll Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {selectedEmail ? (
              <div className="p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Detail View */}
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelectedEmail(null)} className="flex items-center gap-2 text-textMuted hover:text-accent transition-all text-[10px] font-black uppercase tracking-widest">
                    <ChevronLeft size={16} /> Back to Inbox
                  </button>
                  <div className="flex gap-2">
                    <button className="p-2.5 rounded-xl border border-border text-textMuted hover:text-accent transition-all"><Star size={16}/></button>
                    <button onClick={() => deleteEmail(selectedEmail.id)} className="p-2.5 rounded-xl border border-red-500/10 text-red-500/40 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>

                <div className="bg-surface/5 p-8 rounded-[2rem] border border-border shadow-sm border-dashed">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center font-black text-accent text-lg shadow-inner">
                      {selectedEmail.from.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-boltBlack uppercase tracking-tight">{selectedEmail.from}</h2>
                      <p className="text-[9px] text-textMuted font-black uppercase tracking-widest">&lt;{selectedEmail.from.toLowerCase().replace(' ', '.')}@amigo.crm&gt;</p>
                    </div>
                    <span className="ml-auto text-[10px] text-textMuted font-black uppercase tracking-widest">{selectedEmail.date}</span>
                  </div>
                  
                  <div className="border-t border-border/40 pt-8 mt-2">
                    <h3 className="text-lg font-black text-boltBlack mb-6 tracking-tight">{selectedEmail.subject}</h3>
                    <p className="text-sm text-boltBlack leading-relaxed whitespace-pre-wrap font-bold bg-background/50 p-6 rounded-3xl border border-border/20 italic">
                      {selectedEmail.body}
                    </p>
                  </div>

                  {selectedEmail.hasAttachment && (
                    <div className="mt-8 pt-6 border-t border-border/40">
                      <div className="inline-flex items-center gap-3 p-3 bg-background border border-border rounded-xl cursor-pointer hover:border-accent transition-all group">
                         <Paperclip size={14} className="text-accent group-hover:rotate-12 transition-transform" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-textMuted">Attachment_Log.pdf (2.4 MB)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {filteredEmails.length > 0 ? filteredEmails.map((email) => (
                  <div 
                    key={email.id}
                    onClick={() => {
                        setSelectedEmail(email);
                        setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e));
                    }}
                    className={`flex items-center px-6 py-4 hover:bg-surface/40 transition-all cursor-pointer group border-b border-border/40 ${!email.read ? 'bg-accent/5' : ''}`}
                  >
                    <div className="flex items-center gap-4 w-48 shrink-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleStar(email.id); }}
                        className={`transition-colors ${email.starred ? 'text-amber-500 drop-shadow-sm' : 'text-textMuted/20 group-hover:text-amber-500/40'}`}
                      >
                        <Star size={14} fill={email.starred ? 'currentColor' : 'none'} />
                      </button>
                      <div className="text-[11px] font-black uppercase tracking-tight text-boltBlack truncate group-hover:text-accent transition-colors">{email.from}</div>
                    </div>
                    
                    <div className="flex-1 flex items-center min-w-0 px-4">
                      <div className="text-[11px] truncate flex items-center gap-3">
                         <span className={`font-black uppercase tracking-widest inline-block transition-colors ${!email.read ? 'text-boltBlack' : 'text-textMuted/60'}`}>{email.subject}</span>
                         <span className="text-[9px] text-textMuted/40 font-bold truncate transition-all duration-500 group-hover:translate-x-2">— {email.body.substring(0, 50)}...</span>
                      </div>
                      {email.hasAttachment && <Paperclip size={12} className="ml-4 text-textMuted/30" />}
                    </div>

                    <div className="w-32 text-right text-[9px] font-black text-textMuted/40 uppercase tracking-widest tabular-nums italic">
                       {email.date.split(' ').slice(0, 3).join(' ')}
                    </div>
                  </div>
                )) : (
                  <div className="p-32 text-center opacity-10 space-y-4">
                    <Inbox size={96} className="mx-auto" />
                    <p className="text-2xl font-black uppercase tracking-[0.3em]">Vacuum Detected</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[110] p-6 animate-in fade-in duration-300">
          <div className="bg-surface rounded-[2.5rem] w-full max-w-2xl shadow-[0_40px_120px_rgba(0,0,0,0.4)] border border-border overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-emerald-800"></div>
            <div className="px-10 py-8 border-b border-border flex justify-between items-center bg-background/50">
              <div>
                 <h3 className="text-2xl font-black text-boltBlack tracking-tighter uppercase italic">Dispatch Protocol</h3>
                 <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Generating new internal intelligence node</p>
              </div>
              <button onClick={() => setShowCompose(false)} className="text-textMuted hover:text-accent transition-transform hover:rotate-90 duration-300">
                <X size={28} />
              </button>
            </div>

            <form className="p-10 space-y-4 bg-background/20" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] items-center border-b border-border/40 pb-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">To:</label>
                  <div className="px-3 py-2 bg-background/50 rounded-xl text-[10px] font-bold text-textMuted italic border border-dashed border-border flex justify-between items-center cursor-pointer hover:border-accent transition-all">
                    Select Some Options
                    <Plus size={12} className="text-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] items-center border-b border-border/40 pb-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">CC:</label>
                  <div className="px-3 py-2 bg-background/50 rounded-xl text-[10px] font-bold text-textMuted italic border border-dashed border-border flex justify-between items-center cursor-pointer hover:border-accent transition-all">
                    Select Some Options
                    <Plus size={12} className="text-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] items-center border-b border-border/40 pb-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">BCC:</label>
                  <div className="px-3 py-2 bg-background/50 rounded-xl text-[10px] font-bold text-textMuted italic border border-dashed border-border flex justify-between items-center cursor-pointer hover:border-accent transition-all">
                    Select Some Options
                    <Plus size={12} className="text-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] items-center border-b border-border/40 pb-2">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">Subject:</label>
                  <input type="text" className="bg-transparent p-2 outline-none text-xs font-black text-boltBlack transition-all w-full" placeholder="Protocol Subject..." />
                </div>
              </div>
              
              <div className="pt-2">
                 <textarea rows={5} className="w-full bg-background/50 border border-border rounded-[1.5rem] p-6 outline-none focus:border-accent transition-all text-sm font-bold text-boltBlack resize-none shadow-inner italic" placeholder="Begin string..."></textarea>
              </div>

              <div className="pt-6 border-t border-border flex items-center justify-between">
                <div className="flex gap-4">
                  <button className="p-3 bg-background border border-border rounded-xl text-textMuted hover:text-accent transition-all shadow-sm"><Paperclip size={18}/></button>
                  <button className="p-3 bg-background border border-border rounded-xl text-textMuted hover:text-accent transition-all shadow-sm"><MoreVertical size={18}/></button>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowCompose(false)} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-boltBlack transition-colors">Abort</button>
                  <button type="submit" onClick={() => setShowCompose(false)} className="bg-accent text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent/25 hover:scale-105 active:scale-95 transition-all">Launch Transmission</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mailbox;
