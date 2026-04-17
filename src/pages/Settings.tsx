import * as React from 'react';
import { Card, Button, Input, Badge, Avatar } from '../components/UI';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  CreditCard, 
  Database, 
  Globe, 
  Zap, 
  Sparkles,
  Github,
  ChevronRight,
  Cloud,
  Slack,
  Mail
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const SECTIONS = [
  { id: 'profile', name: 'Personal Profile', icon: User },
  { id: 'organization', name: 'Organization', icon: Globe },
  { id: 'intelligence', name: 'AI & Intelligence', icon: Sparkles },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security & Access', icon: Shield },
  { id: 'billing', name: 'Plans & Billing', icon: CreditCard },
  { id: 'integrations', name: 'Integrations', icon: Zap },
];

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState('intelligence');

  return (
    <div className="flex gap-8 h-[calc(100vh-140px)]">
      {/* Sidebar Nav */}
      <div className="w-64 flex flex-col space-y-1">
        <h2 className="px-4 text-[11px] font-bold uppercase tracking-widest text-text-muted mb-4 mt-2">Personal</h2>
        <button
           onClick={() => setActiveTab('profile')}
           className={cn(
             "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
             activeTab === 'profile' ? "bg-white shadow-sm text-primary" : "text-text-muted hover:bg-white/50"
           )}
        >
          <User size={18} /> Profile Settings
        </button>
        
        <h2 className="px-4 text-[11px] font-bold uppercase tracking-widest text-text-muted mb-4 mt-6">Workspace</h2>
        {SECTIONS.slice(1).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              activeTab === item.id ? "bg-white shadow-sm text-primary" : "text-text-muted hover:bg-white/50"
            )}
          >
            <item.icon size={18} className={cn(activeTab === item.id ? "text-primary" : "text-text-muted group-hover:text-primary")} />
            {item.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
        <AnimatePresence mode="wait">
          {activeTab === 'intelligence' && (
            <motion.div
              key="intelligence"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pb-20"
            >
              <div>
                <h1 className="text-2xl font-display font-bold">AI & Intelligence Settings</h1>
                <p className="text-sm text-text-muted">Configure how Ozofi AI interacts with your team and data.</p>
              </div>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-ai-accent/10 flex items-center justify-center">
                      <Sparkles size={20} className="text-ai-accent" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text-main">AI Co-pilot Mode</h3>
                      <p className="text-xs text-text-muted">Set the autonomy level for AI-driven actions and suggestions.</p>
                    </div>
                  </div>
                  <Badge variant="primary" className="bg-ai-accent uppercase text-[10px] h-5 px-2">Experimental</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="p-4 rounded-xl border-2 border-primary bg-primary-light/10 relative">
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-4 border-primary" />
                      <h4 className="text-sm font-bold text-primary mb-1">Advisory</h4>
                      <p className="text-xs text-text-muted">AI purely suggests insights. No automated follow-ups or drafting.</p>
                   </div>
                   <div className="p-4 rounded-xl border border-border bg-muted-surface/30 cursor-pointer hover:border-primary/30 transition-all">
                      <h4 className="text-sm font-bold text-text-main mb-1">Collaborative</h4>
                      <p className="text-xs text-text-muted">AI drafts emails, logs meetings, and pre-fills forms for approval.</p>
                   </div>
                   <div className="p-4 rounded-xl border border-border bg-muted-surface/30 cursor-pointer hover:border-primary/30 transition-all opacity-50">
                      <h4 className="text-sm font-bold text-text-main mb-1">Autonomous</h4>
                      <p className="text-xs text-text-muted truncate">AI manages basic lead nuturing and CRM orchestration automatically.</p>
                   </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-base font-bold text-text-main mb-4">Integrations Intelligence</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 rounded-xl bg-muted-surface border border-border">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#E01E5A]/10 flex items-center justify-center">
                          <Slack size={20} className="text-[#E01E5A]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Slack Real-time Sync</p>
                          <p className="text-xs text-text-muted">Allow AI to summarize Slack threads into CRM notes.</p>
                        </div>
                     </div>
                     <div className="w-10 h-5 bg-primary rounded-full relative">
                        <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full" />
                     </div>
                   </div>

                   <div className="flex items-center justify-between p-4 rounded-xl bg-muted-surface border border-border">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Cloud size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">G-Suite Contextualizer</p>
                          <p className="text-xs text-text-muted">Summarize long email chains into key action items.</p>
                        </div>
                     </div>
                     <div className="w-10 h-5 bg-border rounded-full relative">
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full" />
                     </div>
                   </div>
                </div>
              </Card>

              <div className="flex justify-end gap-3 pt-6">
                 <Button variant="ghost">Reset to Defaults</Button>
                 <Button variant="primary" className="px-8 font-bold">Save Intelligence Profile</Button>
              </div>
            </motion.div>
          )}

          {activeTab !== 'intelligence' && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="h-20 w-20 rounded-2xl bg-muted-surface border border-border flex items-center justify-center text-text-muted">
                <SettingsIcon size={32} />
              </div>
              <div>
                 <h2 className="text-xl font-display font-bold">Settings Module</h2>
                 <p className="text-sm text-text-muted max-w-sm">
                   The {activeTab} settings are being migrated to the Ozofi V2 engine.
                 </p>
              </div>
              <Button variant="outline" onClick={() => setActiveTab('intelligence')}>Back to AI Settings</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { AnimatePresence } from 'motion/react';
