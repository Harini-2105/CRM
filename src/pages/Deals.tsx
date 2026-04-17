import * as React from 'react';
import { Card, Button, Badge, Avatar } from '../components/UI';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Clock, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion, Reorder } from 'motion/react';
import { cn } from '../lib/utils';

const STAGES = [
  { id: 'discovery', name: 'Discovery', count: 12, value: 45000 },
  { id: 'qualified', name: 'Qualified', count: 8, value: 32000 },
  { id: 'proposal', name: 'Proposal', count: 5, value: 125000 },
  { id: 'negotiation', name: 'Negotiation', count: 3, value: 84000 },
  { id: 'closing', name: 'Closing', count: 2, value: 50000 },
];

const DEALS: any = {
  discovery: [
    { id: 1, name: 'Q2 Expansion', company: 'Acme Corp', value: 12000, priority: 'High', owner: 'JD', age: '4d' },
    { id: 2, name: 'Cloud Migration', company: 'Starlight', value: 8500, priority: 'Medium', owner: 'JD', age: '1w' },
  ],
  qualified: [
    { id: 3, name: 'Security Suite', company: 'SecureDesk', value: 15400, priority: 'High', owner: 'AW', age: '2d' },
  ],
  proposal: [
    { id: 4, name: 'Annual License', company: 'Global Tech', value: 45000, priority: 'Critical', owner: 'JS', age: '3d', risk: true },
  ],
  negotiation: [
    { id: 5, name: 'Enterprise Bundle', company: 'Vercel', value: 68000, priority: 'High', owner: 'JD', age: '1d' },
  ],
  closing: [
    { id: 6, name: 'Mobile App Project', company: 'Appy', value: 25000, priority: 'Medium', owner: 'AW', age: '12h' },
  ]
};

const DealCard = ({ deal }: { deal: any; key?: React.Key }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing group relative mb-3"
  >
    <div className="flex justify-between items-start mb-2">
      <h5 className="font-semibold text-sm text-text-strong group-hover:text-primary transition-colors">{deal.name}</h5>
      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
        <MoreVertical size={14} />
      </Button>
    </div>
    
    <p className="text-xs text-text-secondary mb-4">{deal.company}</p>
    
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-text-strong">${deal.value.toLocaleString()}</span>
      <div className="flex -space-x-2">
        <Avatar fallback={deal.owner} className="w-6 h-6 text-[10px] ring-2 ring-surface" />
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
      <div className="flex items-center gap-2">
        {deal.risk ? (
           <Badge variant="danger" className="py-0 px-1 text-[10px] gap-1">
             <AlertCircle size={10} /> Risk
           </Badge>
        ) : (
          <Badge variant="primary" className="py-0 px-1 text-[10px]">{deal.priority}</Badge>
        )}
        <span className="text-[10px] text-text-secondary flex items-center gap-1">
          <Clock size={10} /> {deal.age}
        </span>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-success" title="Activity detected" />
    </div>
  </motion.div>
);

export default function Deals() {
  const [view, setView] = React.useState('kanban');

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Sales Pipeline</h1>
          <p className="text-text-secondary">Track your team's deal progression across stages.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1 bg-border/20 rounded-lg flex items-center">
            <Button 
              variant={view === 'kanban' ? 'primary' : 'ghost'} 
              size="sm" 
              className="h-8 rounded-md"
              onClick={() => setView('kanban')}
            >
              <LayoutGrid size={16} />
            </Button>
            <Button 
              variant={view === 'list' ? 'primary' : 'ghost'} 
              size="sm" 
              className="h-8 rounded-md"
              onClick={() => setView('list')}
            >
              <List size={16} />
            </Button>
          </div>
          <Button variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> New Deal
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface p-4 rounded-xl border border-border">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg">
              <DollarSign size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Pipeline Value</p>
              <p className="text-lg font-bold text-text-strong">$1,240,000</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="p-2 bg-success/5 rounded-lg">
              <TrendingUp size={20} className="text-success" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Winning %</p>
              <p className="text-lg font-bold text-text-strong">32.5%</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/5 rounded-lg">
              <Clock size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Avg. Cycle</p>
              <p className="text-lg font-bold text-text-strong">28 Days</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/5 rounded-lg">
              <Calendar size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Forecasted Q2</p>
              <p className="text-lg font-bold text-text-strong">$850,000</p>
            </div>
         </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-border">
        <div className="flex h-full min-w-max gap-4">
          {STAGES.map((stage) => (
            <div key={stage.id} className="w-[280px] flex flex-col h-full rounded-xl bg-muted-surface/30 border border-border/50">
              <div className="p-4 flex items-center justify-between sticky top-0 bg-muted-surface/5 rounded-t-xl backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                   <h4 className="font-bold text-sm text-text-strong uppercase tracking-wider">{stage.name}</h4>
                   <Badge variant="neutral" className="rounded-md font-bold px-1.5 py-0 min-w-[20px] h-5 justify-center border-none bg-border text-[10px]">
                     {stage.count}
                   </Badge>
                </div>
                <div className="text-xs font-bold text-text-secondary/70">
                  ${(stage.value / 1000).toFixed(0)}k
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
                {(DEALS[stage.id] || []).map((deal: any) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
                <Button variant="ghost" className="w-full h-10 border border-dashed border-border text-text-secondary hover:bg-surface hover:border-primary/50 hover:text-primary mt-2">
                  <Plus size={16} className="mr-2" /> Quick Add
                </Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-[200px] h-full flex flex-col items-center justify-center gap-4 bg-muted-surface/10 border-2 border-dashed border-border rounded-xl text-text-secondary hover:bg-muted-surface/20 transition-all">
            <Plus size={32} />
            <span className="font-bold">Add Stage</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
