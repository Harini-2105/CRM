import * as React from 'react';
import { Card, Button, Badge, Avatar } from '../components/UI';
import { 
  GitBranch, 
  Plus, 
  Play, 
  Settings, 
  MoreHorizontal, 
  Search,
  Zap,
  Clock,
  Mail,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const WORKFLOWS = [
  { id: 1, name: 'New Lead Welcome', status: 'Active', trigger: 'Lead Created', steps: 4, lastRun: '2m ago', success: '98%' },
  { id: 2, name: 'High Value Alert', status: 'Active', trigger: 'Deal Value > $10k', steps: 2, lastRun: '15h ago', success: '100%' },
  { id: 3, name: 'Dormant Lead Re-engagement', status: 'Draft', trigger: 'No activity for 30d', steps: 5, lastRun: '-', success: '-' },
  { id: 4, name: 'Contract Signed Notification', status: 'Active', trigger: 'Deal Won', steps: 3, lastRun: '1d ago', success: '96%' },
];

export default function Workflows() {
  const [activeTab, setActiveTab] = React.useState('all');

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
          <Button variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Create Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Mini-Stats */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-primary/5 border-primary/20">
             <div className="flex items-center gap-3 mb-4">
                <Zap size={20} className="text-primary" />
                <h4 className="font-bold text-sm">Automations</h4>
             </div>
             <div className="space-y-4">
                <div>
                  <p className="text-xs text-text-secondary">Actions executed today</p>
                  <p className="text-2xl font-bold">1,284</p>
                </div>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[70%]" />
                </div>
                <p className="text-[10px] text-text-secondary">70% of weekly quota reached.</p>
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

        {/* Main Workflow Content */}
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
            {WORKFLOWS.map((workflow) => (
              <Card key={workflow.id} className="p-5 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted-surface flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                      <GitBranch size={24} className="text-text-secondary group-hover:text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-strong">{workflow.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
                        <span className="flex items-center gap-1"><Zap size={12} /> {workflow.trigger}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{workflow.steps} steps</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                       <p className="text-[10px] font-bold text-text-secondary uppercase">Success Rate</p>
                       <p className="text-sm font-bold text-text-strong">{workflow.success}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                       <p className="text-[10px] font-bold text-text-secondary uppercase">Last Run</p>
                       <p className="text-sm font-bold text-text-strong">{workflow.lastRun}</p>
                    </div>
                    <Badge variant={workflow.status === 'Active' ? 'success' : 'neutral'}>{workflow.status}</Badge>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Workflow Builder Teaser */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Quick View: Lead Qualification Builder</h3>
            <div className="relative border-2 border-dashed border-border rounded-2xl p-8 bg-muted-surface/20 overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
               
               <div className="relative flex flex-col items-center gap-6">
                  {/* Trigger Node */}
                  <div className="w-48 p-3 rounded-lg bg-surface border border-border flex items-center gap-3 shadow-sm">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <UserPlus size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase text-text-secondary">Trigger</p>
                      <p className="text-xs font-bold">Lead Created</p>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-border flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  {/* Condition Node */}
                  <div className="w-48 p-3 rounded-lg bg-surface border border-border flex items-center gap-3 shadow-sm">
                    <div className="h-8 w-8 rounded-md bg-warning/10 flex items-center justify-center text-warning">
                      <Zap size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase text-text-secondary">Condition</p>
                      <p className="text-xs font-bold">Value {'>'} $5,000</p>
                    </div>
                  </div>

                  <div className="flex gap-24 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-border -z-10" />
                    
                    {/* Action Nodes */}
                    <div className="flex flex-col items-center gap-6">
                       <div className="h-0.5 w-12 bg-border relative">
                          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-border" />
                       </div>
                       <div className="w-48 p-3 rounded-lg bg-surface border border-border flex items-center gap-3 shadow-sm border-l-4 border-l-success">
                        <div className="h-8 w-8 rounded-md bg-success/10 flex items-center justify-center text-success">
                          <Mail size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold uppercase text-text-secondary">Action</p>
                          <p className="text-xs font-bold">Email: High Intent</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                       <div className="w-48 p-3 rounded-lg bg-surface border border-border flex items-center gap-3 shadow-sm border-l-4 border-l-danger">
                        <div className="h-8 w-8 rounded-md bg-text-secondary/10 flex items-center justify-center text-text-secondary">
                          <Clock size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold uppercase text-text-secondary">Action</p>
                          <p className="text-xs font-bold">Wait 48 Hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
               
               <div className="absolute bottom-4 right-4 flex gap-2">
                 <Button variant="outline" size="sm" className="bg-surface">Cancel</Button>
                 <Button variant="primary" size="sm">Publish Workflow</Button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
