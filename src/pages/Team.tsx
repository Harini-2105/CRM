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
  ArrowRight,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { teamService, TeamMember } from '../services/teamService';
import { useAuth } from '../contexts/AuthContext';

export default function Team() {
  const { profile } = useAuth();
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = teamService.subscribeToTeam(profile.orgId, (fetched) => {
      setMembers(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.orgId]);

  const handleDelete = async (id: string, email: string) => {
    if (email === profile?.email) {
      alert("You cannot delete your own profile from the team directory.");
      return;
    }
    if (confirm(`Remove ${email} from the organization?`)) {
      await teamService.deleteMember(id);
    }
  };

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

      {loading ? (
        <div className="py-20 text-center text-text-muted">Loading team members...</div>
      ) : (
        <>
          {/* AI Capacity Insight - Dynamic based on best performer */}
          <Card className="bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] p-6 text-white border-none relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                 <div className="flex items-center gap-2 mb-2">
                   <Sparkles size={20} className="text-white fill-white/20" />
                   <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">AI Talent Intelligence</span>
                 </div>
                 <h2 className="text-xl font-bold mb-2">
                    {members[0]?.displayName || 'The team'} is showing strong {members[0]?.winRate ? `${members[0].winRate} win rate` : 'momentum'} in the current quarter.
                 </h2>
                 <p className="text-sm text-white/70">Ozofi suggests scaling up high-complexity enterprise leads to optimize conversion flow.</p>
              </div>
              <Button className="bg-white text-primary hover:bg-white/90 border-none px-6 font-bold h-11 shrink-0">
                 Scale Team Efforts
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={cn(
                  "p-6 hover:shadow-md transition-all group",
                  member.uid === profile?.uid && "border-primary/50 bg-primary/5"
                )}>
                   <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar fallback={member.displayName ? member.displayName[0] : 'U'} className="w-12 h-12 text-lg" />
                          <div className={cn(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface",
                            member.status === 'active' ? "bg-success" : member.status === 'in_meeting' ? "bg-warning" : "bg-border"
                          )} />
                        </div>
                        <div>
                           <h3 className="text-base font-bold text-text-main group-hover:text-primary transition-colors">
                             {member.displayName} {member.uid === profile?.uid && "(You)"}
                           </h3>
                           <p className="text-xs text-text-muted capitalize">{member.role?.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 italic transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-danger" onClick={() => handleDelete(member.id!, member.email)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2 mb-6">
                     <div className="text-center p-2 bg-muted-surface rounded-lg">
                        <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Win Rate</p>
                        <p className="text-xs font-bold text-text-main">{member.winRate || '0%'}</p>
                     </div>
                     <div className="text-center p-2 bg-muted-surface rounded-lg">
                        <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Quota</p>
                        <p className="text-xs font-bold text-text-main">{member.quotaAttainment || '0%'}</p>
                     </div>
                     <div className="text-center p-2 bg-muted-surface rounded-lg">
                        <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Deals</p>
                        <p className="text-xs font-bold text-text-main">{member.dealsCount || 0}</p>
                     </div>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-text-muted hover:text-primary cursor-pointer transition-colors max-w-[150px]">
                        <Mail size={14} className="shrink-0" />
                        <span className="text-xs truncate">{member.email}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary-light">
                        CRM Review
                      </Button>
                   </div>
                </Card>
              </motion.div>
            ))}
            
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
        </>
      )}
    </div>
  );
}
