import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, PhoneCall, Info, User,
  Settings as SettingsIcon, Shield, UserPlus, Clock, Bot,
  FileText, BarChart2, MessageSquare, Mail, MessageCircle,
  Radio, BookOpen, CreditCard, Activity, LogOut
} from 'lucide-react';

const Sidebar = ({ onLogout, user, isMobile, onClose, isDarkMode }) => {
  const isAdmin = user?.role === 'admin';

  const adminItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Leads',     icon: UserPlus,         path: '/dashboard/leads' },
    { name: 'Contacts',  icon: Users,            path: '/dashboard/clients' },
    { name: 'Follow up', icon: Clock,            path: '/dashboard/followup' },
    { name: 'Free Trial',icon: Activity,         path: '/dashboard/freetrial' },
    { name: 'Client',    icon: Users,            path: '/dashboard/clients' },
    { name: 'Sales Order',icon: FileText,        path: '/dashboard/salesorder' },
    { name: 'Compliance',icon: Shield,           path: '/dashboard/compliance', adminOnly: true },
    { name: 'MIS',       icon: BarChart2,        path: '/dashboard/mis',        adminOnly: true },
    { name: 'Whatsapp',  icon: MessageSquare,    path: '/dashboard/whatsapp',   adminOnly: true },
    { name: 'Inbox',    icon: Mail,             path: '/dashboard/mail' },
    { name: 'SMS Box',   icon: MessageCircle,    path: '/dashboard/sms' },
    { name: 'Voice Box', icon: Radio,            path: '/dashboard/voice' },
    { name: 'Policies',  icon: BookOpen,         path: '/dashboard/policies' },
    { name: 'Reports',   icon: BarChart2,        path: '/dashboard/reports',    adminOnly: true },
    { name: 'Call Logs', icon: PhoneCall,        path: '/dashboard/calls' },
    { name: 'Details',   icon: Info,             path: '/dashboard/details' },
  ];

  const navItems = adminItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  if (!isAdmin) {
    navItems.splice(7, 0, { name: 'Payment', icon: CreditCard, path: '/dashboard/payment' });
  }

  return (
    <div className="flex flex-col w-64 h-full z-30 overflow-hidden font-sans transition-all duration-500 bg-surface text-textMain border-r border-border backdrop-blur-xl">

      {/* Logo Section */}
      <div className="p-6 border-b border-border flex items-center gap-4 shrink-0 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-60"></div>
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-emerald-800 to-accent flex items-center justify-center shadow-lg shadow-accent/20 transition-all duration-500 cursor-default relative shrink-0">
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-white font-black text-xl tracking-tighter drop-shadow-md">A</span>
        </div>
        <div className="relative flex flex-col justify-center">
          <h1 className="text-textMain font-black text-lg tracking-tighter uppercase leading-none group-hover:tracking-widest transition-all duration-500">
            AMIGO
          </h1>
          <p className="text-textMuted text-[7px] uppercase font-black tracking-[0.3em] mt-1 opacity-50">{isAdmin ? 'Command Center' : 'Network Associate'}</p>
        </div>
        {isMobile && (
          <button 
            onClick={onClose}
            className="ml-auto p-2 glass-panel rounded-lg transition-all text-textMuted hover:text-accent active:scale-95 shadow-sm"
            title="Close Protocol"
          >
            <LogOut size={14} className="rotate-180" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar transition-all duration-500">
        {navItems.map((item) => (
          <NavLink
            key={item.name + item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={() => isMobile && onClose()}
            className={({ isActive }) =>
              `flex items-center px-5 py-3 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.15em] relative group ${
                isActive
                  ? 'bg-accent/10 text-accent shadow-[0_10px_30px_rgba(34,211,238,0.15)] border border-accent/10 translate-x-2'
                  : 'text-boltBlack hover:bg-white/5 hover:text-accent border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`mr-4 shrink-0 transition-all duration-500 ${isActive ? 'text-accent scale-110 rotate-12' : 'text-textMuted/30 group-hover:text-accent group-hover:rotate-6'}`} size={16} />
                <span className="truncate group-hover:translate-x-1 transition-transform">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>
                )}
                {!isActive && (
                  <div className="ml-auto w-0 h-0.5 bg-accent/40 rounded-full group-hover:w-4 transition-all duration-500"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

    </div>
  );
};

export default Sidebar;
