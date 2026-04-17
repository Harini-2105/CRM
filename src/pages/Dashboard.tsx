import * as React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles
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
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const PIPELINE_DATA = [
  { name: 'Discovery', value: 400 },
  { name: 'Qualified', value: 300 },
  { name: 'Proposal', value: 300 },
  { name: 'Negotiation', value: 200 },
];

const COLORS = ['#4F46E5', '#6366F1', '#8B5CF6', '#10B981'];

const StatCard = ({ title, value, change, trend, icon: Icon }: any) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-primary/5 rounded-lg">
        <Icon size={20} className="text-primary" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1">
      {trend === 'up' ? (
        <Badge variant="success" className="gap-1 border-none py-0 px-1">
          <ArrowUpRight size={14} /> {change}
        </Badge>
      ) : (
        <Badge variant="danger" className="gap-1 border-none py-0 px-1">
          <ArrowDownRight size={14} /> {change}
        </Badge>
      ) }
      <span className="text-xs text-text-secondary">vs last month</span>
    </div>
  </Card>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Welcome back, Jane</h1>
          <p className="text-text-secondary">Here's what's happening with your pipeline today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar size={16} /> Last 30 days
          </Button>
          <Button variant="primary" size="sm" className="gap-2">
            Add Deal
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard title="Total Pipeline" value="$4,284,500" change="12%" trend="up" icon={DollarSign} />
        <StatCard title="Active Deals" value="156" change="4 new" trend="up" icon={Zap} />
        <StatCard title="Win Rate" value="64.2%" change="0.5%" trend="down" icon={TrendingUp} />
      </div>

      {/* AI Insights Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center gap-4"
      >
        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Sparkles size={20} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-accent">AI Insight: Deal "Acme Corp Expansion" is at risk</h4>
          <p className="text-xs text-text-secondary truncate">No activity in 7 days. Suggested action: Send follow-up summary of yesterday's product release.</p>
        </div>
        <Button variant="outline" size="sm" className="bg-surface border-accent/20 text-accent hover:bg-accent/5">View Action</Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg">Revenue Growth</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <div className="w-3 h-3 rounded-full bg-primary" /> Projected
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <div className="w-3 h-3 rounded-full bg-border" /> Actual
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Table Area */}
          <Card className="p-0">
             <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg">Active High-Value Deals</h3>
                <Button variant="outline" size="sm" className="text-xs h-7">View Pipeline</Button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted-surface border-b border-border">
                      <th className="px-6 py-3 font-bold text-[11px] text-text-muted uppercase tracking-wider">Deal Name</th>
                      <th className="px-6 py-3 font-bold text-[11px] text-text-muted uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 font-bold text-[11px] text-text-muted uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 font-bold text-[11px] text-text-muted uppercase tracking-wider">Stage</th>
                      <th className="px-6 py-3 font-bold text-[11px] text-text-muted uppercase tracking-wider">Probability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-text-main">Global Expansion</td>
                      <td className="px-6 py-4 text-sm text-text-muted">Stripe Inc.</td>
                      <td className="px-6 py-4 text-sm font-bold">$450,000</td>
                      <td className="px-6 py-4"><Badge variant="success">Negotiation</Badge></td>
                      <td className="px-6 py-4 text-sm">85%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-text-main">Enterprise Cloud</td>
                      <td className="px-6 py-4 text-sm text-text-muted">Acme Corp</td>
                      <td className="px-6 py-4 text-sm font-bold">$125,000</td>
                      <td className="px-6 py-4"><Badge variant="primary">Proposal</Badge></td>
                      <td className="px-6 py-4 text-sm">60%</td>
                    </tr>
                  </tbody>
               </table>
             </div>
          </Card>
        </div>

        {/* Right AI Panel */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-white to-[#F5F3FF] border border-[#DDD6FE] rounded-2xl p-6 relative overflow-hidden group shadow-sm"
          >
            <Badge className="mb-4 bg-ai-accent text-white uppercase text-[10px] font-extrabold rounded-md h-5 px-2">Priority Insight</Badge>
            <h3 className="text-[15px] font-bold text-text-main mb-4 leading-relaxed">
              Strategic account "Acme Corp" hasn't been contacted in 6 days. Risk of stall detected.
            </h3>
            <div className="flex items-center gap-1.5 text-ai-accent text-xs font-bold cursor-pointer hover:translate-x-1 transition-transform">
              Draft follow-up email <ArrowRight size={14} />
            </div>
          </motion.div>

          {/* Activity Feed */}
          <Card className="p-6">
             <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-wider">Relationship Timeline</h3>
             <div className="space-y-6 relative before:absolute before:inset-0 before:ml-1 before:-z-10 before:h-full before:w-px before:bg-border/50">
               <div className="flex gap-4 relative">
                 <div className="h-2 w-2 rounded-full bg-success mt-1.5 shrink-0 z-10 ring-4 ring-surface" />
                 <div className="flex-1">
                   <div className="text-[13px] leading-relaxed">
                     <span className="font-bold">Sarah Chen</span> moved <span className="font-bold">Project Mars</span> to <Badge variant="success" className="py-0 h-4 text-[10px]">Won</Badge>
                   </div>
                   <p className="text-[11px] text-text-muted mt-1">24 mins ago</p>
                 </div>
               </div>
               <div className="flex gap-4 relative">
                 <div className="h-2 w-2 rounded-full bg-border mt-1.5 shrink-0 z-10 ring-4 ring-surface" />
                 <div className="flex-1">
                   <div className="text-[13px] leading-relaxed">
                     <span className="font-bold">James Wilson</span> logged a meeting with <span className="font-bold">Airbnb HQ</span>
                   </div>
                   <p className="text-[11px] text-text-muted mt-1">2 hours ago</p>
                 </div>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
