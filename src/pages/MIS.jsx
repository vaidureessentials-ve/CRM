import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
  BarChart2, TrendingUp, Users, Target, Calendar, 
  Filter, Download, ChevronRight, Activity, PieChart
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

const MIS = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartKey, setChartKey] = useState(0);

  // Simulated data for Linear-style charts
  const performanceData = [
    { name: 'Mon', revenue: 4000, leads: 24 },
    { name: 'Tue', revenue: 3000, leads: 13 },
    { name: 'Wed', revenue: 5500, leads: 31 },
    { name: 'Thu', revenue: 4800, leads: 22 },
    { name: 'Fri', revenue: 6100, leads: 38 },
    { name: 'Sat', revenue: 3200, leads: 15 },
    { name: 'Sun', revenue: 2100, leads: 9 },
  ];

  useEffect(() => {
    const fetchMISData = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch MIS data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMISData();

    // Force re-render of chart after mount to ensure container dimensions are captured
    const timer = setTimeout(() => setChartKey(prev => prev + 1), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 fade-in text-textMain transition-colors duration-300">
      {/* Linear Style Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-xl border border-accent/20">
              <BarChart2 size={20} className="text-accent" />
            </div>
            <span className="text-[10px] font-black text-textMuted uppercase tracking-[0.3em]">Management Information System</span>
          </div>
          <h1 className="text-4xl font-black text-textMain tracking-tighter">Performance Audit</h1>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-textMuted bg-surface border border-border rounded-xl hover:bg-background transition-all shadow-sm">
            <Calendar size={14} className="text-accent" />
            This Month
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white premium-gradient rounded-xl hover:opacity-90 transition-all shadow-lg shadow-accent/20">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MISCard label="Global Revenue" value="Rs. 8,42,000" trend="+12.5%" icon={TrendingUp} />
        <MISCard label="Lead Efficiency" value="68.4%" trend="+2.1%" icon={Target} />
        <MISCard label="Active Associates" value={stats?.totalUsers || 0} trend="Stable" icon={Users} />
        <MISCard label="Conversion Rate" value="24.2%" trend="-0.4%" icon={Activity} isNegative={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend - Area Chart */}
        <div className="lg:col-span-2 glass-panel border-none p-8">
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-textMain">Revenue Velocity</h3>
              <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest mt-1">Growth progression over last 7 days</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-lg shadow-accent/40"></span>
              <span className="text-[10px] font-black text-textMain uppercase tracking-widest">Growth Curve</span>
            </div>
          </div>
          <div className="h-[320px] w-full" key={chartKey}>
            {chartKey > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)', padding: '12px 16px'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Distribution - Quick Audit */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-textMain mb-6">Status Distribution</h3>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <StatusProgress label="Lead Converted" percent={74} color="bg-primary" />
            <StatusProgress label="Follow Up Pending" percent={42} color="bg-blue-500" />
            <StatusProgress label="Client Retention" percent={88} color="bg-emerald-500" />
            <StatusProgress label="System Utilization" percent={92} color="bg-amber-500" />
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50">
            <button className="w-full py-2.5 text-[10px] font-bold text-primary hover:bg-primary/5 rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2">
              View Full Audit Log
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MISCard = ({ label, value, trend, icon: Icon, isNegative }) => (
  <div className="bg-surface border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="p-3 bg-background rounded-2xl text-primary group-hover:scale-110 transition-transform duration-500 shadow-sm border border-border">
        <Icon size={18} />
      </div>
      <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase ${isNegative ? 'text-red-500 bg-red-500/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
        {trend}
      </span>
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] leading-none mb-2">{label}</p>
      <p className="text-2xl font-black text-textMain tracking-tighter">{value}</p>
    </div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
  </div>
);

const StatusProgress = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black text-textMuted uppercase tracking-wider">{label}</span>
      <span className="text-[10px] font-black text-textMain">{percent}%</span>
    </div>
    <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border/50">
      <div className={`h-full ${color.includes('primary') ? 'bg-accent' : color} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.2)]`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default MIS;
