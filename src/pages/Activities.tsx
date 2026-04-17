import * as React from 'react';
import { Card, Button, Badge, Avatar, Input } from '../components/UI';
import { 
  Phone, 
  Mail, 
  Video, 
  FileText, 
  MessageSquare, 
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Sparkles,
  ArrowRight,
  Edit2,
  Trash2,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { activityService, Activity } from '../services/activityService';
import { ActivityModal } from '../components/ActivityModal';

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'call': return <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Phone size={14} /></div>;
    case 'meeting': return <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Video size={14} /></div>;
    case 'email': return <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><Mail size={14} /></div>;
    case 'note': return <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><FileText size={14} /></div>;
    case 'task': return <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Clock size={14} /></div>;
    default: return <div className="p-2 bg-primary-light text-primary rounded-lg"><Sparkles size={14} /></div>;
  }
};

export default function Activities() {
  const { profile } = useAuth();
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = activityService.subscribeToActivities(profile.orgId, (fetchedActivities) => {
      setActivities(fetchedActivities);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.orgId]);

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity entry?')) {
      await activityService.deleteActivity(id);
    }
  };

  const filteredActivities = activities.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Activity Explorer</h1>
          <p className="text-text-muted">A global timeline of every relationship motion across Ozofi.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar size={16} /> Schedule Sync
          </Button>
          <Button variant="primary" size="sm" className="gap-2" onClick={openAddModal}>
            <PlusIcon size={16} /> Log Activity
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-border">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            placeholder="Search activity by type, title, or keywords..." 
            className="pl-10 border-none bg-transparent focus:ring-0 shadow-none text-sm h-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" className="gap-2 text-text-muted font-bold">
          <Filter size={16} /> Filters
        </Button>
      </div>

      <div className="space-y-4">
        {/* AI Grouping Summary */}
        <Card className="bg-gradient-to-br from-white to-[#F5F3FF] border border-[#DDD6FE] p-6">
           <div className="flex items-center gap-2 mb-4">
             <Sparkles size={18} className="text-[#6366F1] fill-[#6366F1]/10" />
             <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#6366F1]">AI Activity Insights</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-sm font-bold text-text-main mb-1">Momentum Graph</p>
                <p className="text-xs text-text-muted leading-relaxed">Engagement is trending up {activities.length > 5 ? '24%' : '0%'} this morning. Your pipeline is active.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-text-main mb-1">Follow-up Gap</p>
                <p className="text-xs text-text-muted leading-relaxed">System identifies {activities.filter(a => a.type === 'meeting').length} meetings this month. Enusre notes are logged.</p>
              </div>
              <div className="flex items-center justify-end">
                 <Button variant="outline" size="sm" className="text-xs font-bold text-[#6366F1] border-[#6366F1]/30 hover:bg-[#6366F1]/5">
                   Summarize Week <ArrowRight size={14} className="ml-2" />
                 </Button>
              </div>
           </div>
        </Card>

        {/* Timeline */}
        <div className="relative space-y-4 before:absolute before:inset-0 before:ml-10 before:-z-10 before:h-full before:w-px before:bg-border/60">
          {loading ? (
            <div className="p-12 text-center text-text-muted">Loading activity timeline...</div>
          ) : filteredActivities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-6 group"
            >
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-[10px] text-text-muted z-10 shrink-0">
                  {activity.type.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 w-px bg-border/50 group-last:hidden" />
              </div>

              <Card className="flex-1 p-5 hover:border-primary/40 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <TypeIcon type={activity.type}/>
                    <div>
                      <p className="text-sm font-medium">
                        <span className="font-bold text-text-main hover:text-primary cursor-pointer transition-colors" onClick={() => handleEdit(activity)}>
                          {activity.title}
                        </span>
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {activity.type.toUpperCase()} • {activity.date ? new Date(activity.date).toLocaleString() : 'N/A'} • {activity.linkedEntityType}: {activity.linkedEntityId || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-primary" onClick={() => handleEdit(activity)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-danger" onClick={() => handleDelete(activity.id!)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {activity.description && (
                  <div className="bg-muted-surface/50 rounded-xl p-4 border border-border/40">
                    <p className="text-sm text-text-main leading-relaxed italic">
                      "{activity.description}"
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-end">
                   <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary-light" onClick={() => handleEdit(activity)}>
                      View Details
                   </Button>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {!loading && filteredActivities.length === 0 && (
            <div className="p-12 text-center text-text-muted border border-dashed border-border rounded-xl">
              No activity logged yet. Your global timeline is waiting.
            </div>
          )}
        </div>
      </div>

      <ActivityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        activity={selectedActivity} 
      />
    </div>
  );
}

import { Plus as PlusIcon } from 'lucide-react';
