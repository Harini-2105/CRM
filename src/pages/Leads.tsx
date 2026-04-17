import * as React from 'react';
import { Card, Button, Input, Badge, Avatar } from '../components/UI';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  ArrowUpDown,
  Download,
  Upload,
  Zap,
  Star,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

const LEADS = [
  { id: 1, name: 'Alice Freeman', company: 'Global Tech', source: 'Web Referral', status: 'Qualified', score: 85, owner: 'Jane Doe', lastActivity: '2h ago' },
  { id: 2, name: 'Bob Smith', company: 'Infinite Scale', source: 'LinkedIn', status: 'Prospect', score: 42, owner: 'John Smith', lastActivity: '1d ago' },
  { id: 3, name: 'Charlie Brown', company: 'Nebula AI', source: 'Direct', status: 'Contacted', score: 68, owner: 'Alex Wong', lastActivity: '5h ago' },
  { id: 4, name: 'Diana Ross', company: 'Prism Designs', source: 'Conference', status: 'Nurture', score: 31, owner: 'Jane Doe', lastActivity: '3d ago' },
  { id: 5, name: 'Edward Norton', company: 'Fight Club Co', source: 'Web Referral', status: 'Closed - Won', score: 99, owner: 'John Smith', lastActivity: '12m ago' },
  { id: 6, name: 'Fiona Apple', company: 'Music Box', source: 'Cold Email', status: 'Prospect', score: 55, owner: 'Alex Wong', lastActivity: '6h ago' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const variants: any = {
    'Qualified': 'success',
    'Prospect': 'neutral',
    'Contacted': 'primary',
    'Nurture': 'warning',
    'Closed - Won': 'success',
  };
  return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
};

export default function Leads() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Leads</h1>
          <p className="text-text-secondary">Explore and manage potential business opportunities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} /> Export
          </Button>
          <Button variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Add Lead
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted-surface/30">
          <div className="flex items-center gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <Input placeholder="Search leads..." className="pl-10 h-9 bg-surface" />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} /> Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-sm text-text-secondary mr-2">6 leads found</span>
             <Button variant="ghost" size="icon" className="h-8 w-8">
               <ArrowUpDown size={16} />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8">
               <MoreHorizontal size={16} />
             </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted-surface/50 border-b border-border">
                <th className="px-6 py-3 font-semibold text-xs text-text-secondary uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                    <span>Lead Name</span>
                  </div>
                </th>
                <th className="px-6 py-3 font-semibold text-xs text-text-secondary uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 font-semibold text-xs text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold text-xs text-text-secondary uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 font-semibold text-xs text-text-secondary uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 font-semibold text-xs text-text-secondary uppercase tracking-wider text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LEADS.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted-surface/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-text-strong">{lead.name}</span>
                        <span className="text-xs text-text-secondary">{lead.source}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{lead.company}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-border h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            lead.score > 80 ? "bg-success" : lead.score > 50 ? "bg-primary" : "bg-warning"
                          )} 
                          style={{ width: `${lead.score}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-text-strong">{lead.score}</span>
                      {lead.score > 80 && <Zap size={12} className="text-accent fill-accent" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar fallback={lead.owner.split(' ').map(n=>n[0]).join('')} className="h-6 w-6 text-[10px]" />
                      <span className="text-sm">{lead.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-text-secondary">{lead.lastActivity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span>Showing 1 to 6 of 6 entries</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="bg-primary/5 border-primary/20 text-primary">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      {/* AI Recommended Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h4 className="font-bold">AI High-Intent Prospects</h4>
          </div>
          <p className="text-xs text-text-secondary mb-4">These leads show high engagement patterns similar to your top closed deals.</p>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted-surface/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                   <Avatar fallback={i === 1 ? 'AF' : 'EC'} className="h-8 w-8" />
                   <div>
                     <p className="text-xs font-bold">{i === 1 ? 'Alice Freeman' : 'Eric Chen'}</p>
                     <p className="text-[10px] text-text-secondary">Opened pricing page 4 times today</p>
                   </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold text-primary">Engage</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} className="text-accent" />
            <h4 className="font-bold">Dormant Accounts</h4>
          </div>
          <p className="text-xs text-text-secondary mb-4">It's been over 30 days since the last contact. Recommend reaching out to re-ignite interest.</p>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-muted-surface/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                   <Avatar fallback="BS" className="h-8 w-8" />
                   <div>
                     <p className="text-xs font-bold">Bob Smith</p>
                     <p className="text-[10px] text-text-secondary">Last interaction was Mar 12, 2026</p>
                   </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold text-accent">Revive</Button>
              </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
