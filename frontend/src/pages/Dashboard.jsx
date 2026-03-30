import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Search, Mail as MailIcon, MoreHorizontal, User, Settings as SettingsIcon, LogOut, Shield, Target, Award, TrendingUp, Bot, FileText, MessageSquare, MessageCircle, Radio, BookOpen, BarChart2, CreditCard, Activity, PhoneCall, Users, UserCheck, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

import Leads from './Leads';
import Clients from './Clients';
import Calls from './Calls';
import Admin from './Admin';
import Settings from './Settings';
import MIS from './MIS';
import FollowUp from './FollowUp';
import Details from './Details';
import Profile from './Profile';
import ComingSoon from './ComingSoon';
import FreeTrials from './FreeTrials';
import SalesOrders from './SalesOrders';

const COLORS = ['#0f172a', '#10b981', '#1e293b', '#6366f1', '#fbbf24'];

const StatTile = ({ label, value, sub, color = 'gray', isDarkMode }) => {
  const colorMap = {
    gray: isDarkMode ? 'text-white' : 'text-primary',
    green: 'text-accent',
    blue: 'text-blue-400',
    amber: 'text-orange-400',
    purple: 'text-violet-400',
  };

  const glowMap = {
    gray: 'group-hover:shadow-white/5',
    green: 'group-hover:shadow-accent/10',
    blue: 'group-hover:shadow-blue-500/10',
    amber: 'group-hover:shadow-orange-500/10',
    purple: 'group-hover:shadow-violet-500/10',
  };

  return (
    <div className={`p-6 glass-panel group relative overflow-hidden active:scale-[0.98] cursor-pointer ${glowMap[color]}`}>
      {/* Decorative background glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none rounded-full ${colorMap[color].replace('text-', 'bg-')}`}></div>
      
      <p className={`text-4xl font-black tracking-tighter mt-1 mb-1 transition-transform group-hover:scale-105 duration-500 ${colorMap[color]}`}>{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-textMuted flex items-center gap-2">
        {label}
        <TrendingUp size={10} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
      </p>
      {sub && <p className="text-[10px] mt-2 text-textMuted/60 italic font-medium">{sub}</p>}
    </div>
  );
};

const DashboardOverview = ({ user, associates, todaySales, todayFollowUps, todayFreeTrial, totalSalesAmount, isDarkMode }) => {
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    // Force re-render of chart after mount to ensure container dimensions are captured
    const timer = setTimeout(() => setChartKey(prev => prev + 1), 100);
    return () => clearTimeout(timer);
  }, []);

  const chartData = associates
    ?.filter(a => a.role !== 'admin')
    .map(a => ({
      name: a.name.split(' ')[0],
      Revenue: (a.clients?.length || 0) * 100 + (Math.random() * 50000), 
    }))
    .sort((a, b) => b.Revenue - a.Revenue)
    .slice(0, 5) || [];

  const teamCount = associates?.filter(a => a.role !== 'admin').length || 0;

  return (
    <div className="p-6 space-y-8 fade-in flex-1 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
            Market Insights
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          </h2>
          <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mt-1">Real-time performance metrics</p>
        </div>
      </div>

      <div className={`grid gap-4 ${user?.role === 'admin' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'}`}>
        <StatTile label="Total Sales" value={`Rs.${totalSalesAmount}`} color="green" isDarkMode={isDarkMode} />
        <StatTile label="Today's Sales" value={`Rs.${todaySales * 100}`} color="blue" isDarkMode={isDarkMode} />
        <StatTile label="Today's Free Trial" value={todayFreeTrial} color="purple" isDarkMode={isDarkMode} />
        <StatTile label="Today's Follow Up" value={todayFollowUps} color="amber" isDarkMode={isDarkMode} />
        {user?.role === 'admin' && <StatTile label="Team Member" value={teamCount} color="gray" isDarkMode={isDarkMode} />}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 glass-panel border-none min-h-[460px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
                <BarChart2 size={18} className="text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-textMain">Top 5 Employee Performance</h3>
                <p className="text-[9px] font-bold text-textMuted uppercase tracking-tight">Revenue based analysis</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest bg-white/5 text-textMuted border border-white/5">Weekly</span>
              <span className="text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest bg-accent/20 text-accent border border-accent/20">Monthly</span>
            </div>
          </div>
          <div className="h-[300px] w-full" key={chartKey}>
            {chartKey > 0 && (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} dy={12} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }} />
                <Tooltip
                  cursor={{ fill: 'var(--border)', opacity: 0.1 }}
                  contentStyle={{ borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', backdropFilter: 'blur(10px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="Revenue" radius={[8, 8, 0, 0]} barSize={28} fill="url(#barGradient)">
                  {chartData.map((_, index) => (
                    <Cell key={index} className="hover:opacity-80 transition-opacity cursor-pointer duration-300" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 glass-panel relative overflow-hidden group border-none">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/10 blur-[60px] rounded-full group-hover:bg-accent/20 transition-colors duration-1000"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-accent/40 transition-colors duration-500">
                <Target size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-textMuted">Team Target</p>
                <h3 className="text-3xl font-black text-textMain tracking-tighter">Global</h3>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-accent premium-gradient w-[15%] rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-[9px] font-black text-textMuted uppercase">0% Completed</p>
                <div className="text-right">
                  <p className="text-[10px] font-black text-textMuted uppercase opacity-50">Global Target</p>
                  <p className="text-sm font-black text-accent">Rs. 1.6M</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 glass-panel border-none group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10"><Award size={14} className="text-emerald-500" /></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-textMuted">Achieved</p>
              </div>
              <p className="text-xl font-black text-emerald-500 group-hover:scale-105 transition-transform duration-500">Rs. 0</p>
            </div>
            <div className="p-6 glass-panel border-none group text-orange-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-500/10"><TrendingUp size={14} className="text-orange-500" /></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-textMuted">Remaining</p>
              </div>
              <p className="text-xl font-black group-hover:scale-105 transition-transform duration-500">Rs. 1.6L</p>
            </div>
          </div>

          <div className="p-8 glass-panel border-dashed border-2 flex flex-col items-center justify-center min-h-[160px] group hover:border-accent/30 transition-all duration-500">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-white/5">
              <FileText size={20} className="text-textMuted group-hover:text-accent" />
            </div>
            <h3 className="text-sm font-black text-textMain uppercase tracking-widest mb-1">Fetching Report</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors">Click Here</button>
          </div>
        </div>
      </div>

      {/* Admin: Associate Audit Table */}
      {user?.role === 'admin' && associates?.filter(a => a.role !== 'admin').length > 0 && (
        <div className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/5 shadow-xl shadow-black/20' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className={`px-5 py-4 border-b flex items-center gap-2 ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
            <Shield size={15} className="text-primary" />
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Associate Performance Audit</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-wider transition-colors ${isDarkMode ? 'text-white/20 bg-white/5' : 'text-gray-400 bg-gray-50/40'}`}>
                <th className="px-5 py-3 text-left">Associate</th>
                <th className="px-5 py-3 text-center">Clients</th>
                <th className="px-5 py-3 text-center">Calls</th>
                <th className="px-5 py-3 text-center">Sales</th>
                <th className="px-5 py-3 text-left">SIP Extension</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
              {associates.filter(a => a.role !== 'admin').map(assoc => (
                <tr key={assoc._id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDarkMode ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                        {assoc.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-bold ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{assoc.name}</p>
                        <p className={`text-[10px] ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>{assoc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-3 text-center font-bold ${isDarkMode ? 'text-white/70' : 'text-gray-800'}`}>{assoc.clients?.length || 0}</td>
                  <td className={`px-5 py-3 text-center font-bold ${isDarkMode ? 'text-white/70' : 'text-gray-800'}`}>{assoc.calls?.length || 0}</td>
                  <td className="px-5 py-3 text-center font-bold text-emerald-500">Rs.{(assoc.clients?.length || 0) * 100}</td>
                  <td className={`px-5 py-3 text-xs ${isDarkMode ? 'text-white/20' : 'text-gray-500'}`}>Ext: {assoc.sipExtension}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ user, onLogout, isDarkMode, setIsDarkMode }) => {
  const [associates, setAssociates] = useState([]);
  const [todaySales, setTodaySales] = useState(0);
  const [todayFollowUps, setTodayFollowUps] = useState(0);
  const [todayFreeTrial, setTodayFreeTrial] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchAssociates();
    fetchStats();
  }, [user]);

  const fetchAssociates = async () => {
    try {
      const res = await api.get('/auth/associates');
      setAssociates(res.data);
    } catch (err) {
      console.error('Failed to fetch associates for dashboard', err);
    }
  };

  const fetchStats = async () => {
    try {
      // Today's sales (leads converted today)
      api.get('/leads')
        .then(res => {
          const today = new Date().toDateString();
          setTodaySales(res.data.filter(l => l.status === 'Converted' && new Date(l.updatedAt).toDateString() === today).length);
        }).catch(() => {});

      // Today's follow ups pending
      api.get('/followups')
        .then(res => {
          const today = new Date().toDateString();
          setTodayFollowUps(res.data.filter(f => f.status === 'Pending' && new Date(f.followUpDate).toDateString() === today).length);
        }).catch(() => {});

      // Free Trials
      api.get('/freetrials')
        .then(res => {
          const today = new Date().toDateString();
          setTodayFreeTrial(res.data.filter(t => new Date(t.createdAt).toDateString() === today).length);
        }).catch(() => {});

      // Total Sales Amount (Revenue)
      api.get('/salesorders')
        .then(res => {
          const total = res.data.reduce((sum, order) => sum + (order.amount || 0), 0);
          setTotalSalesAmount(total);
        }).catch(() => {});
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    }
  };

  return (
    <div className="flex h-full transition-colors duration-300 bg-background">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-64 right-0 h-14 flex items-center justify-between px-6 z-20 border-b shadow-sm transition-colors duration-300 bg-surface border-border text-textMain">
        <div className="flex items-center gap-6 flex-1 text-slate-400">
          <button className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-primary'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="relative w-full max-w-md ml-4 group">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-white/20 group-focus-within:text-accent' : 'text-slate-300 group-focus-within:text-accent'}`} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className={`rounded-xl w-full pl-9 pr-4 py-2 text-xs transition-all placeholder:text-slate-300 outline-none ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:ring-accent/10 focus:border-accent' : 'bg-slate-50 border-slate-100 text-slate-600 focus:ring-accent/5 focus:border-accent focus:bg-white'}`} 
            />
          </div>
        </div>

        <div className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mx-auto shadow-sm transition-colors ${isDarkMode ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-accent/5 border-accent/10 text-accent'}`}>
          AMIGO {user?.role === 'admin' ? 'Security' : 'Pulse'} Gateway
        </div>

        <div className="flex items-center gap-3 justify-end flex-1">
          {/* Quick Stats in Header */}
          <div className="hidden xl:flex items-center gap-2 mr-4">
            <div className="px-3 py-1.5 rounded-xl bg-surface border border-border flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Follow Up: {todayFollowUps}</span>
            </div>
          </div>

          {/* Theme Toggle in Header */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl border border-border shadow-sm bg-surface text-textMuted hover:text-accent transition-all hover:scale-105"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="p-2.5 rounded-xl border border-border shadow-sm cursor-pointer transition-all group bg-surface hover:scale-105">
            <MailIcon size={16} className="text-textMuted group-hover:text-accent transition-colors" />
          </div>

          <div className="relative">
            <div 
              className="flex items-center gap-3 pl-4 border-l border-border transition-opacity cursor-pointer hover:opacity-80 group"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-slate-700 flex items-center justify-center text-[11px] font-black text-white border-2 border-white shadow-lg shadow-primary/10 uppercase group-hover:scale-105 transition-all">
                {user?.name?.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[10px] font-black uppercase tracking-wider text-textMain">{user?.name}</p>
                <div className="flex items-center gap-1">
                  <p className="text-[9px] text-textMuted font-bold uppercase tracking-tight">{user?.role || 'User'}</p>
                  <svg className={`w-3 h-3 text-textMuted transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-3 w-64 bg-surface rounded-[1.5rem] shadow-2xl border border-border p-2 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 bg-background/50 rounded-2xl mb-2 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm border-2 border-surface shadow-md">
                      {user?.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-textMain uppercase tracking-tight truncate">{user?.name}</p>
                      <p className="text-[10px] text-accent font-bold uppercase tracking-widest">{user?.role || 'Associate'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <button className="w-full flex items-center px-4 py-2.5 text-[11px] font-bold text-textMuted hover:bg-background hover:text-textMain rounded-xl transition-colors gap-3 group">
                      <User size={14} className="group-hover:text-accent" />
                      <span>My Profile</span>
                    </button>
                    <button className="w-full flex items-center px-4 py-2.5 text-[11px] font-bold text-textMuted hover:bg-background hover:text-textMain rounded-xl transition-colors gap-3 group">
                      <SettingsIcon size={14} className="group-hover:text-accent" />
                      <span>Account Settings</span>
                    </button>
                    
                    <div className="h-px bg-border my-2 mx-4"></div>
                    
                    <button onClick={onLogout} className="w-full flex items-center px-4 py-2.5 text-[11px] font-black text-red-500 hover:bg-red-500/10 rounded-xl transition-all gap-3 active:scale-95">
                      <LogOut size={14} />
                      <span className="uppercase tracking-widest">Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 mt-14 flex flex-col min-h-0">
        {/* Secondary Sub-header Bar (Buttons and Alerts) */}
        <div className="border-b flex items-center justify-between px-6 py-3 sticky top-0 z-10 transition-colors duration-300 bg-surface border-border">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tight mr-6 text-textMain">{getPageTitle()}</h1>
            <div className="flex items-center gap-2">
              <button className="bg-primary/5 border border-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Cloud Server</button>
              <button className="bg-primary/5 border border-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Sticky Notes</button>
              <button className="bg-accent text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_4px_12px_-2px_rgba(16,185,129,0.3)]">Lead Request</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-background border border-border flex items-center gap-2">
              <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">Pending SO: <span className="text-accent underline decoration-2 underline-offset-4">0</span></span>
            </div>
            <select className="bg-background border border-border rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-textMuted outline-none focus:border-accent transition-all cursor-pointer">
              <option>-- Select Manager --</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview user={user} associates={associates} todaySales={todaySales} todayFollowUps={todayFollowUps} todayFreeTrial={todayFreeTrial} totalSalesAmount={totalSalesAmount} isDarkMode={isDarkMode} />} />
              <Route path="/leads" element={<Leads user={user} />} />
              <Route path="/clients" element={<Clients user={user} />} />
              <Route path="/calls" element={<Calls user={user} />} />
              <Route path="/admin" element={<Admin user={user} />} />
              <Route path="/settings" element={<Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
              <Route path="/followup" element={<FollowUp user={user} />} />
              <Route path="/details" element={<Details />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/ai" element={<ComingSoon title="AI Insights" icon={Bot} />} />
              <Route path="/freetrial" element={<FreeTrials />} />
              <Route path="/salesorder" element={<SalesOrders />} />
              <Route path="/compliance" element={<ComingSoon title="Compliance Audit" icon={Shield} />} />
              <Route path="/mis" element={user?.role === 'admin' ? <MIS user={user} /> : <Navigate to="/" />} />
              <Route path="/whatsapp" element={<ComingSoon title="WhatsApp Marketing" icon={MessageSquare} />} />
              <Route path="/mail" element={<ComingSoon title="Enterprise Mailbox" icon={MailIcon} />} />
              <Route path="/sms" element={<ComingSoon title="SMS Broadcasting" icon={MessageCircle} />} />
              <Route path="/voice" element={<ComingSoon title="Voice Logs" icon={Radio} />} />
              <Route path="/policies" element={<ComingSoon title="Company Policies" icon={BookOpen} />} />
              <Route path="/reports" element={<ComingSoon title="Advanced Reporting" icon={BarChart2} />} />
              <Route path="/payment" element={<ComingSoon title="Payment Gateway" icon={CreditCard} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
