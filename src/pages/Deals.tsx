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
  AlertCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, Reorder } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { dealService, Deal } from '../services/dealService';
import { DealModal } from '../components/DealModal';

const STAGES = [
  { id: 'discovery', name: 'Discovery' },
  { id: 'qualified', name: 'Qualified' },
  { id: 'proposal', name: 'Proposal' },
  { id: 'negotiation', name: 'Negotiation' },
  { id: 'closing', name: 'Closing' },
  { id: 'closed', name: 'Closed' },
];

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onEdit }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing group relative mb-3"
    onClick={() => onEdit(deal)}
  >
    <div className="flex justify-between items-start mb-2">
      <h5 className="font-semibold text-sm text-text-strong group-hover:text-primary transition-colors">{deal.title}</h5>
      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
        <MoreVertical size={14} />
      </Button>
    </div>
    
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-text-strong">{deal.currency} {deal.value.toLocaleString()}</span>
    </div>

    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge variant={deal.status === 'won' ? 'success' : deal.status === 'lost' ? 'danger' : 'primary'} className="py-0 px-1 text-[10px]">
          {deal.status.toUpperCase()}
        </Badge>
      </div>
      <div className={cn(
        "h-1.5 w-1.5 rounded-full",
        deal.status === 'won' ? "bg-success" : deal.status === 'lost' ? "bg-danger" : "bg-primary"
      )} />
    </div>
  </motion.div>
);

export default function Deals() {
  const { profile } = useAuth();
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState('kanban');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDeal, setSelectedDeal] = React.useState<Deal | null>(null);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = dealService.subscribeToDeals(profile.orgId, (fetchedDeals) => {
      setDeals(fetchedDeals);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.orgId]);

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const totalValue = deals.reduce((acc, deal) => acc + (deal.value || 0), 0);
  const winCount = deals.filter(d => d.status === 'won').length;
  const winRate = deals.length > 0 ? (winCount / deals.length) * 100 : 0;

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
          <Button variant="primary" size="sm" className="gap-2" onClick={openAddModal}>
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
              <p className="text-lg font-bold text-text-strong">${totalValue.toLocaleString()}</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="p-2 bg-success/5 rounded-lg">
              <TrendingUp size={20} className="text-success" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Win Rate</p>
              <p className="text-lg font-bold text-text-strong">{winRate.toFixed(1)}%</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/5 rounded-lg">
              <Clock size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Active Deals</p>
              <p className="text-lg font-bold text-text-strong">{deals.filter(d => d.status === 'open').length}</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/5 rounded-lg">
              <Calendar size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Total Count</p>
              <p className="text-lg font-bold text-text-strong">{deals.length}</p>
            </div>
         </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-border">
        <div className="flex h-full min-w-max gap-4">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter(d => d.stageId === stage.id);
            const stageValue = stageDeals.reduce((acc, d) => acc + (d.value || 0), 0);
            
            return (
              <div key={stage.id} className="w-[280px] flex flex-col h-full rounded-xl bg-muted-surface/30 border border-border/50">
                <div className="p-4 flex items-center justify-between sticky top-0 bg-muted-surface/5 rounded-t-xl backdrop-blur-sm z-10">
                  <div className="flex items-center gap-2">
                     <h4 className="font-bold text-sm text-text-strong uppercase tracking-wider">{stage.name}</h4>
                     <Badge variant="neutral" className="rounded-md font-bold px-1.5 py-0 min-w-[20px] h-5 justify-center border-none bg-border text-[10px]">
                       {stageDeals.length}
                     </Badge>
                  </div>
                  <div className="text-xs font-bold text-text-secondary/70">
                    ${(stageValue / 1000).toFixed(1)}k
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
                  {stageDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} onEdit={handleEdit} />
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full h-10 border border-dashed border-border text-text-secondary hover:bg-surface hover:border-primary/50 hover:text-primary mt-2"
                    onClick={openAddModal}
                  >
                    <Plus size={16} className="mr-2" /> Quick Add
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        deal={selectedDeal} 
      />
    </div>
  );
}
