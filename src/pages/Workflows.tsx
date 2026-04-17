import * as React from 'react';
import { Card, Button, Badge, Avatar } from '../components/UI';
import { 
  GitBranch, 
  Plus, 
  Play, 
  MoreHorizontal, 
  Search,
  Zap,
  Clock,
  Mail,
  UserPlus,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { workflowService, Workflow } from '../services/workflowService';
import { WorkflowModal } from '../components/WorkflowModal';

export default function Workflows() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = React.useState('all');
  const [workflows, setWorkflows] = React.useState<Workflow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<Workflow | null>(null);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = workflowService.subscribeToWorkflows(profile.orgId, (fetched) => {
      setWorkflows(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.orgId]);

  const handleEdit = (wf: Workflow) => {
    setSelectedWorkflow(wf);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedWorkflow(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this automation?')) {
      await workflowService.deleteWorkflow(id);
    }
  };

  const filteredWorkflows = workflows.filter(wf => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return wf.status === 'active';
    if (activeTab === 'drafts') return wf.status === 'draft' || wf.status === 'paused';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-text-strong">Automation Workflows</h1>
          <p className="text-text-secondary">Set up intelligent triggers and actions to automate your sales cycle.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Play size={16} /> Test Active
          </Button>
          <Button variant="primary" size="sm" className="gap-2" onClick={openAddModal}>
            <Plus size={16} /> Create Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-primary/5 border-primary/20">
             <div className="flex items-center gap-3 mb-4">
                <Zap size={20} className="text-primary" />
                <h4 className="font-bold text-sm">Automations</h4>
             </div>
             <div className="space-y-4">
                <div>
                  <p className="text-xs text-text-secondary">Workflows active</p>
                  <p className="text-2xl font-bold">{workflows.filter(w=>w.status==='active').length}</p>
                </div>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[40%]" />
                </div>
                <p className="text-[10px] text-text-secondary">Dynamic optimization in effect.</p>
             </div>
          </Card>

          <Card className="p-4">
             <h4 className="font-bold text-sm mb-4">Integrations</h4>
             <div className="space-y-3">
                {['Slack', 'Gmail', 'WhatsApp', 'Zoom'].map(app => (
                  <div key={app} className="flex items-center justify-between">
                    <span className="text-xs font-medium">{app}</span>
                    <Badge variant="success" className="text-[10px] py-0">Connected</Badge>
                  </div>
                ))}
             </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-px">
            {['All', 'Active', 'Drafts', 'Templates'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "px-4 py-2 text-sm font-semibold transition-all relative",
                  activeTab === tab.toLowerCase() ? "text-primary" : "text-text-secondary hover:text-text-strong"
                )}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <motion.div layoutId="workflow-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="p-12 text-center text-text-muted">Loading automations...</div>
            ) : filteredWorkflows.length > 0 ? (
              filteredWorkflows.map((workflow) => (
                <Card key={workflow.id} className="p-5 hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4" onClick={() => handleEdit(workflow)}>
                      <div className="h-12 w-12 rounded-xl bg-muted-surface flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <GitBranch size={24} className="text-text-secondary group-hover:text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-strong">{workflow.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
                          <span className="flex items-center gap-1 uppercase tracking-tighter"><Zap size={12} /> {workflow.trigger}</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="uppercase tracking-tighter">{workflow.action}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge variant={workflow.status === 'active' ? 'success' : 'neutral'}>{workflow.status}</Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-primary" onClick={(e) => { e.stopPropagation(); handleEdit(workflow); }}>
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(workflow.id!); }}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="p-12 text-center text-text-muted border border-dashed border-border rounded-xl">
                 No workflows found in this category.
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Lead Qualification Logic</h3>
            <div className="relative border-2 border-dashed border-border rounded-2xl p-8 bg-muted-surface/20 overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
               <div className="relative flex flex-col items-center gap-6">
                  <div className="w-48 p-3 rounded-lg bg-surface border border-border flex items-center gap-3 shadow-sm scale-90 opacity-60">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary"><UserPlus size={16} /></div>
                    <div className="flex-1"><p className="text-[10px] font-bold uppercase text-text-secondary">Trigger</p><p className="text-xs font-bold">New Lead</p></div>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="w-48 p-3 rounded-lg bg-surface border border-border flex items-center gap-3 shadow-sm border-l-4 border-l-primary">
                    <div className="h-8 w-8 rounded-md bg-ai-accent/10 flex items-center justify-center text-ai-accent"><Zap size={16} /></div>
                    <div className="flex-1"><p className="text-[10px] font-bold uppercase text-text-secondary">Action</p><p className="text-xs font-bold">Intelligent Scoring</p></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <WorkflowModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        workflow={selectedWorkflow} 
      />
    </div>
  );
}
