import * as React from 'react';
import { Card, Button, Badge, Avatar } from '../components/UI';
import { 
  Plus, 
  Mail, 
  MoreVertical, 
  Shield, 
  Zap, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

const TEAM = [
  { id: 1, name: 'Jane Doe', role: 'Sales Director', status: 'Active', email: 'jane@ozofi.com', deals: 24, winRate: '72%', quota: '85%' },
  { id: 2, name: 'Alex Rivers', role: 'Account Executive', status: 'Active', email: 'alex@ozofi.com', deals: 18, winRate: '64%', quota: '92%' },
  { id: 3, name: 'Sarah Chen', role: 'Customer Success', status: 'In Meeting', email: 'sarah@ozofi.com', deals: 12, winRate: '88%', quota: '95%' },
  { id: 4, name: 'James Wilson', role: 'Sales Development', status: 'Offline', email: 'james@ozofi.com', deals: 32, winRate: '45%', quota: '105%' },
  { id: 5, name: 'Fiona Apple', role: 'Marketing Lead', status: 'Active', email: 'fiona@ozofi.com', deals: 0, winRate: '-', quota: '-' },
];

export default function Team() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Team Directory</h1>
          <p className="text-text-muted">Manage your organization's roster and performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Permission Groups</Button>
          <Button variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Invite Member
          </Button>
        </div>
      </div>

      {/* AI Capacity Insight */}
      <Card className="bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] p-6 text-white border-none relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
             <div className="flex items-center gap-2 mb-2">
               <Sparkles size={20} className="text-white fill-white/20" />
               <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">AI Talent Intelligence</span>
             </div>
             <h2 className="text-xl font-bold mb-2">Alex Rivers is operating at 92% of quota with a 15% shorter sales cycle than the team average.</h2>
             <p className="text-sm text-white/70">Ozofi suggests assigning high-complexity Fintech leads to Alex for maximum conversion potential.</p>
          </div>
          <Button className="bg-white text-primary hover:bg-white/90 border-none px-6 font-bold h-11 shrink-0">
             View Alex's Profile
          </Button>
        </div>
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6 hover:shadow-md transition-all group">
               <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar fallback={member.name.split(' ').map(n => n[0]).join('')} className="w-12 h-12 text-lg" />
                      <div className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface",
                        member.status === 'Active' ? "bg-success" : member.status === 'In Meeting' ? "bg-warning" : "bg-border"
                      )} />
                    </div>
                    <div>
                       <h3 className="text-base font-bold text-text-main group-hover:text-primary transition-colors">{member.name}</h3>
                       <p className="text-xs text-text-muted">{member.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted opacity-0 group-hover:opacity-100 italic">
                    <MoreVertical size={16} />
                  </Button>
               </div>

               <div className="grid grid-cols-3 gap-2 mb-6">
                 <div className="text-center p-2 bg-muted-surface rounded-lg">
                    <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Win Rate</p>
                    <p className="text-xs font-bold text-text-main">{member.winRate}</p>
                 </div>
                 <div className="text-center p-2 bg-muted-surface rounded-lg">
                    <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Quota</p>
                    <p className="text-xs font-bold text-text-main">{member.quota}</p>
                 </div>
                 <div className="text-center p-2 bg-muted-surface rounded-lg">
                    <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Deals</p>
                    <p className="text-xs font-bold text-text-main">{member.deals}</p>
                 </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-text-muted hover:text-primary cursor-pointer transition-colors">
                    <Mail size={14} />
                    <span className="text-xs">{member.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary-light">
                    View CRM Activity
                  </Button>
               </div>
            </Card>
          </motion.div>
        ))}
        
        {/* Add Member Placeholder */}
        <motion.button
          whileHover={{ scale: 0.99 }}
          className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-border rounded-xl bg-muted-surface/20 text-text-muted hover:border-primary/30 hover:bg-primary-light/10 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-surface border-2 border-border flex items-center justify-center group-hover:border-primary group-hover:text-primary">
            <Plus size={24} />
          </div>
          <div className="text-center">
            <p className="font-bold text-sm text-text-main">Add New Member</p>
            <p className="text-xs">Expand your sales power</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
