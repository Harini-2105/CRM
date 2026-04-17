import * as React from 'react';
import { Card, Button, Input, Badge, Avatar } from '../components/UI';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  ArrowUpDown,
  Download,
  Zap,
  Star,
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { leadService, Lead } from '../services/leadService';
import { LeadModal } from '../components/LeadModal';

const StatusBadge = ({ status }: { status: string }) => {
  const variants: any = {
    'Qualified': 'success',
    'Prospect': 'neutral',
    'Contacted': 'primary',
    'Nurture': 'warning',
    'Closed - Won': 'success',
    'Closed - Lost': 'danger',
  };
  return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
};

export default function Leads() {
  const { profile } = useAuth();
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = leadService.subscribeToLeads(profile.orgId, (fetchedLeads) => {
      setLeads(fetchedLeads);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.orgId]);

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      await leadService.deleteLead(id);
    }
  };

  const openAddModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const filteredLeads = leads.filter(l => 
    `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button variant="primary" size="sm" className="gap-2" onClick={openAddModal}>
            <Plus size={16} /> Add Lead
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted-surface/30">
          <div className="flex items-center gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <Input 
                placeholder="Search leads..." 
                className="pl-10 h-9 bg-surface" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} /> Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-sm text-text-secondary mr-2">{filteredLeads.length} leads found</span>
             <Button variant="ghost" size="icon" className="h-8 w-8">
               <ArrowUpDown size={16} />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8">
               <MoreHorizontal size={16} />
             </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary text-sm">Syncing with your organization...</p>
            </div>
          ) : (
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
                  <th className="px-6 py-3 font-semibold text-xs text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted-surface/50 transition-colors group cursor-pointer" onClick={() => handleEdit(lead)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" onClick={(e) => e.stopPropagation()} />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-text-strong">{lead.firstName} {lead.lastName}</span>
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
                        <Avatar fallback={profile?.displayName[0] || 'U'} className="h-6 w-6 text-[10px]" />
                        <span className="text-sm">{profile?.displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary"
                          onClick={(e) => { e.stopPropagation(); handleEdit(lead); }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-danger"
                          onClick={(e) => { e.stopPropagation(); handleDelete(lead.id!); }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                      No leads found. Click "Add Lead" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span>Showing {filteredLeads.length} entries</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="bg-primary/5 border-primary/20 text-primary">1</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        lead={selectedLead} 
      />

      {/* AI Recommended Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h4 className="font-bold">AI High-Intent Prospects</h4>
          </div>
          <p className="text-xs text-text-secondary mb-4">These leads show high engagement patterns similar to your top closed deals.</p>
          <div className="space-y-3">
            {leads
              .filter(l => l.score > 70 && l.status !== 'Closed - Won')
              .slice(0, 3)
              .map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-muted-surface/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                   <Avatar fallback={lead.firstName[0] + lead.lastName[0]} className="h-8 w-8 text-[10px]" />
                   <div>
                     <p className="text-xs font-bold">{lead.firstName} {lead.lastName}</p>
                     <p className="text-[10px] text-text-secondary">{lead.company} • {lead.score}% Score</p>
                   </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold text-primary" onClick={() => handleEdit(lead)}>Engage</Button>
              </div>
            ))}
            {leads.filter(l => l.score > 70 && l.status !== 'Closed - Won').length === 0 && (
              <p className="text-xs text-text-secondary text-center py-4 italic">No high-intent leads detected yet.</p>
            )}
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} className="text-accent" />
            <h4 className="font-bold">Dormant Accounts</h4>
          </div>
          <p className="text-xs text-text-secondary mb-4">Leads that haven't been contacted recently and require attention.</p>
          <div className="space-y-3">
            {leads
              .filter(l => l.status === 'Prospect' || l.status === 'Nurture')
              .slice(0, 3)
              .map(lead => (
               <div key={lead.id} className="flex items-center justify-between p-3 bg-muted-surface/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                     <Avatar fallback={lead.firstName[0] + lead.lastName[0]} className="h-8 w-8 text-[10px]" />
                     <div>
                       <p className="text-xs font-bold">{lead.firstName} {lead.lastName}</p>
                       <p className="text-[10px] text-text-secondary">Awaiting initial outreach</p>
                     </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold text-accent" onClick={() => handleEdit(lead)}>Revive</Button>
                </div>
              ))}
              {leads.filter(l => l.status === 'Prospect' || l.status === 'Nurture').length === 0 && (
                <p className="text-xs text-text-secondary text-center py-4 italic">Your pipeline is looking healthy!</p>
              )}
          </div>
        </Card>
      </div>
    </div>
  );
}
