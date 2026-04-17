import * as React from 'react';
import { Card, Button, Badge, Input } from '../components/UI';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  DollarSign, 
  Download, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  ChevronDown,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Layout
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { dealService, Deal } from '../services/dealService';
import { leadService, Lead } from '../services/leadService';
import { cn } from '../lib/utils';

const FUNNEL_DATA = [
  { stage: 'Prospects', count: 1200, conversion: '100%' },
  { stage: 'Qualified', count: 800, conversion: '66%' },
  { stage: 'Proposal', count: 450, conversion: '56%' },
  { stage: 'Negotiation', count: 210, conversion: '46%' },
  { stage: 'Closed Won', count: 164, conversion: '78%' },
];

export default function Reports() {
  const { profile } = useAuth();
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubDeals = dealService.subscribeToDeals(profile.orgId, (f) => setDeals(f));
    const unsubLeads = leadService.subscribeToLeads(profile.orgId, (f) => setLeads(f));

    return () => {
      unsubDeals();
      unsubLeads();
    };
  }, [profile?.orgId]);

  const totalValue = deals.reduce((acc, d) => acc + (d.value || 0), 0);
  const wonDealsValue = deals.filter(d => d.status === 'won').reduce((acc, d) => acc + (d.value || 0), 0);
  const winRate = deals.length > 0 ? (deals.filter(d => d.status === 'won').length / deals.length) * 100 : 0;
  
  const COLORS = ['#4F46E5', '#8B5CF6', '#10B981', '#F59E0B'];

  const sourceData = leads.reduce((acc: any[], lead) => {
    const source = lead.source || 'Unknown';
    const existing = acc.find(a => a.name === source);
    if (existing) existing.value++;
    else acc.push({ name: source, value: 1 });
    return acc;
  }, []);

  const REVENUE_BY_MONTH = [
    { name: 'Jan', actual: 4000, projected: 4400 },
    { name: 'Feb', actual: 3000, projected: 3200 },
    { name: 'Mar', actual: wonDealsValue > 0 ? wonDealsValue : 5000, projected: 4800 },
    { name: 'Apr', actual: 4780, projected: 5200 },
    { name: 'May', actual: 5890, projected: 6100 },
    { name: 'Jun', actual: 6390, projected: 6600 },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Revenue Intelligence</h1>
          <p className="text-text-muted">Executive-ready analytics and lifecycle conversion reporting.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Download size={16} /> Export PDF
          </Button>
          <Button variant="primary" size="sm" className="gap-2 font-bold px-4">
            <Calendar size={16} /> Last 90 Days <ChevronDown size={14} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-border overflow-x-auto scrollbar-hide">
         <div className="flex items-center gap-1.5 px-3 min-w-max">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mr-2">Dashboards:</span>
            {['Sales Performance', 'Funnel Conversion', 'Marketing Attribution', 'Team Productivity'].map((tab, i) => (
              <Badge key={tab} className={cn(
                "cursor-pointer h-7 px-3 border-none font-bold text-[10px] uppercase tracking-wider transition-all",
                i === 0 ? "bg-primary text-white" : "bg-muted-surface text-text-muted hover:bg-primary-light hover:text-primary"
              )}>{tab}</Badge>
            ))}
         </div>
         <div className="h-6 w-px bg-border shrink-0" />
         <Button variant="ghost" size="sm" className="gap-2 text-text-muted font-bold min-w-max">
            <Filter size={16} /> Advanced Filters
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Top Line KPIs */}
         <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Total Pipeline</p>
               <h3 className="text-2xl font-bold text-text-main">${totalValue.toLocaleString()}</h3>
               <div className="flex items-center gap-1.5 mt-2 text-success font-bold text-xs uppercase">
                 <ArrowUpRight size={14} /> 12.4% <span className="text-text-muted font-medium font-sans">vs prev period</span>
               </div>
            </Card>
            <Card className="p-6">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Win Rate</p>
               <h3 className="text-2xl font-bold text-text-main">{winRate.toFixed(1)}%</h3>
               <div className="flex items-center gap-1.5 mt-2 text-warning font-bold text-xs uppercase">
                 <ArrowDownRight size={14} /> 2.1% <span className="text-text-muted font-medium font-sans">vs prev period</span>
               </div>
            </Card>
            <Card className="p-6">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Closed Revenue</p>
               <h3 className="text-2xl font-bold text-text-main">${wonDealsValue.toLocaleString()}</h3>
               <div className="flex items-center gap-1.5 mt-2 text-success font-bold text-xs uppercase">
                 <ArrowUpRight size={14} /> 4 Days <span className="text-text-muted font-medium font-sans">Faster</span>
               </div>
            </Card>
            <Card className="p-6">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Total Deals</p>
               <h3 className="text-2xl font-bold text-text-main">{deals.length}</h3>
               <div className="flex items-center gap-1.5 mt-2 text-success font-bold text-xs uppercase">
                 <ArrowUpRight size={14} /> 18.2% <span className="text-text-muted font-medium font-sans">vs prev period</span>
               </div>
            </Card>
         </div>

         {/* Main Revenue Chart */}
         <Card className="lg:col-span-3 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
               <div>
                  <h3 className="text-lg font-bold text-text-main">Revenue vs Projected</h3>
                  <p className="text-xs text-text-muted">Track actual revenue performance against quarterly forecasts.</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                     <div className="w-3 h-3 rounded bg-primary" /> Actual Revenue
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                     <div className="w-3 h-3 rounded bg-ai-accent opacity-30" /> Projected Forecast
                  </div>
               </div>
            </div>
            <div className="h-[340px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_BY_MONTH}>
                     <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                           <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                     />
                     <Area type="monotone" dataKey="projected" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
                     <Area type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Distribution Chart */}
         <Card className="lg:col-span-1 p-6">
            <h3 className="text-lg font-bold text-text-main mb-2">Lead Sources</h3>
            <p className="text-xs text-text-muted mb-8">Direct attribution breakdown.</p>
            <div className="h-[240px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={sourceData.length > 0 ? sourceData : [{ name: 'No Data', value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                     >
                        {sourceData.map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        {sourceData.length === 0 && <Cell fill="#E2E8F0" />}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-3">
               {sourceData.map((item: any, index: number) => (
                  <div key={item.name} className="flex items-center justify-between hover:bg-muted-surface p-2 rounded-lg transition-colors cursor-default group">
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[13px] font-medium text-text-muted group-hover:text-text-main transition-colors">{item.name}</span>
                     </div>
                     <span className="text-sm font-bold text-text-main">{item.value}</span>
                  </div>
               ))}
            </div>
         </Card>

         {/* Funnel Section */}
         <Card className="lg:col-span-4 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
               <div>
                  <h3 className="text-xl font-bold text-text-main">Sales Conversion Funnel</h3>
                  <p className="text-sm text-text-muted mt-1">Lifecycle analysis from prospect to closed revenue.</p>
               </div>
               <div className="bg-primary-light/30 p-4 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <TrendingUp className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary mb-0.5">Global Efficiency</p>
                    <p className="text-xl font-bold text-text-main">4.2x Faster <span className="text-[12px] font-medium text-text-muted font-sans">than industry avg</span></p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
               {FUNNEL_DATA.map((step, i) => (
                  <div key={step.stage} className="relative group">
                     <div className="bg-muted-surface p-6 rounded-2xl border border-border group-hover:border-primary transition-all text-center relative z-10 overflow-hidden">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">{step.stage}</p>
                        <h4 className="text-2xl font-bold text-text-main mb-1">{step.count}</h4>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                           {step.conversion}
                        </div>
                        {/* Abstract visual funnel shape */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-primary/5 transition-all duration-500" 
                          style={{ height: `${100 - (i * 20)}%` }} 
                        />
                     </div>
                     {i < FUNNEL_DATA.length - 1 && (
                        <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-border items-center justify-center text-primary shadow-sm group-hover:border-primary transition-colors">
                           <ArrowUpRight size={14} className="rotate-45" />
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </Card>
      </div>

      {/* AI Narrative Section */}
      <Card className="bg-gradient-to-br from-white to-[#F5F3FF] border border-[#DDD6FE] p-8">
         <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-ai-accent/10 flex items-center justify-center">
               <Sparkles size={20} className="text-ai-accent fill-ai-accent/20" />
            </div>
            <div>
               <h3 className="text-base font-bold text-text-main">Intelligence Briefing</h3>
               <p className="text-xs text-text-muted">Ozofi AI's automated interpretation of current performance.</p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
               <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border group hover:border-ai-accent/40 transition-all cursor-default relative">
                  <div className="p-2 bg-success/10 text-success rounded-lg shrink-0">
                     <TrendingUp size={16} />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-text-main">Predictive Lead Success</p>
                     <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        Based on the current volume of "Qualified" leads, we are on track to exceed the quarterly target by 14% if conversion rates hold.
                     </p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border group hover:border-ai-accent/40 transition-all cursor-default">
                  <div className="p-2 bg-warning/10 text-warning rounded-lg shrink-0">
                     <Zap size={16} />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-text-main">Mid-Funnel Friction</p>
                     <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        Deals at "Negotiation" stage are spending 4.2 days longer than average. Possible bottleneck in legal approval workflow identified.
                     </p>
                  </div>
               </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center space-y-4 bg-muted-surface/30 rounded-2xl p-6 border border-dashed border-border">
               <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-ai-accent mb-2">
                  <BarChartIcon size={32} />
               </div>
               <h4 className="text-lg font-bold text-text-main">Customize Your Briefing</h4>
               <p className="text-sm text-text-muted max-w-xs">Ask Ozofi AI to generate reports based on custom natural language queries.</p>
               <Button variant="outline" className="text-xs font-bold gap-2 text-ai-accent border-ai-accent/30 hover:bg-ai-accent/5 px-8">
                  Open AI Workspace <Layout size={14} />
               </Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
