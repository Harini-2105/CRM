import * as React from 'react';
import { Card, Button, Badge, Avatar, Input } from '../components/UI';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  MessageSquare, 
  ArrowRight,
  Zap,
  Star,
  BrainCircuit,
  PieChart,
  Lightbulb
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const INSIGHTS = [
  {
    type: 'critical',
    title: 'High Burn Rate Detected',
    desc: 'You have 15 deals in "Negotiation" that haven\'t moved in 10 days. Total value at risk: $420k.',
    action: 'Send follow-up nudge',
    icon: AlertCircle,
    color: 'text-danger',
    bg: 'bg-danger/5',
    border: 'border-danger/20'
  },
  {
    type: 'opportunity',
    title: 'Warm Lead Re-engagement',
    desc: 'TechNow Corp reopened your proposal for the 5th time this morning. They are likely in final decision mode.',
    action: 'Call Eric Chen',
    icon: Zap,
    color: 'text-success',
    bg: 'bg-success/5',
    border: 'border-success/20'
  },
  {
    type: 'suggestion',
    title: 'Suggesting New Workflow',
    desc: 'Based on your recent win with "Vercel", I recommend creating an automated upsell workflow for developer tools.',
    action: 'Review Template',
    icon: Lightbulb,
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20'
  }
];

export default function AIInsights() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
               <BrainCircuit className="text-accent" size={24} />
            </div>
            AI Insights
          </h1>
          <p className="text-text-secondary">Ozofi's intelligence engine analyzing your pipeline and relationships.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
             <Star size={16} /> Mark as Useful
          </Button>
          <Button variant="primary" size="sm" className="gap-2 bg-accent hover:bg-accent/90">
             <Zap size={16} /> Re-analyze Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary/60 px-1">Priority Attention</h3>
          
          <div className="space-y-4">
            {INSIGHTS.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={cn("p-6 border-l-4", insight.border, insight.bg)}>
                  <div className="flex gap-4">
                    <div className={cn("h-10 w-10 rounded-xl bg-surface shadow-sm border border-border flex items-center justify-center shrink-0", insight.color)}>
                      <insight.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-text-strong">{insight.title}</h4>
                        <span className="text-[10px] font-bold text-text-secondary uppercase">Just Now</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-4 leading-relaxed">{insight.desc}</p>
                      <div className="flex items-center gap-2">
                         <Button size="sm" variant="primary" className={cn("font-bold text-xs h-8", insight.type === 'critical' ? 'bg-danger' : insight.type === 'opportunity' ? 'bg-success' : 'bg-primary')}>
                           {insight.action}
                         </Button>
                         <Button size="sm" variant="ghost" className="text-xs h-8">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary/60 px-1 mb-4">Account Growth Intelligence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[1, 2].map(i => (
                 <Card key={i} className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                       <Avatar fallback={i === 1 ? 'AC' : 'GC'} className="h-8 w-8" />
                       <div>
                         <p className="text-sm font-bold">{i === 1 ? 'Acme Corp' : 'Globex'}</p>
                         <p className="text-[10px] text-text-secondary">Health Score: {i === 1 ? '82' : '94'}</p>
                       </div>
                    </div>
                    <div className="p-3 bg-muted-surface rounded-lg">
                       <p className="text-xs italic text-text-secondary leading-relaxed">
                         "Relationship is stable. {i === 1 ? 'They recently hired 20 new sales reps' : 'Usage of your API increased by 300%'}. High probability for expansion."
                       </p>
                    </div>
                    <Button variant="ghost" className="w-full mt-4 h-8 text-[10px] font-bold text-primary">Generate Account Brief</Button>
                 </Card>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div className="space-y-6">
          <Card className="p-6 bg-text-strong text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <h4 className="text-sm font-bold text-white/60 mb-6 uppercase tracking-widest">Pipeline Health</h4>
            
            <div className="flex flex-col items-center py-4">
               <div className="relative h-32 w-32 mb-6">
                  <svg className="h-full w-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364.4" strokeDashoffset="91.1" className="text-accent" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">75%</span>
                    <span className="text-[10px] text-white/50 uppercase">Stable</span>
                  </div>
               </div>
               
               <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-white/60">Lead velocity</span>
                     <span className="text-success flex items-center gap-1"><TrendingUp size={12} /> +12%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-white/60">Deal churn</span>
                     <span className="text-danger flex items-center gap-1"><TrendingDown size={12} /> -2%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-white/60">Avg. response time</span>
                     <span className="text-white font-bold">4.2h</span>
                  </div>
               </div>
            </div>

            <Button className="w-full mt-6 bg-accent border-none hover:bg-accent/90 text-[10px] font-bold h-8">Download PDF Report</Button>
          </Card>

          <Card className="p-6">
            <h4 className="font-bold text-sm mb-4">AI Chat Assistant</h4>
            <div className="space-y-4">
               <div className="p-3 bg-muted-surface rounded-xl rounded-bl-none text-xs text-text-secondary max-w-[90%]">
                 Hello Jane! I've analyzed your upcoming meeting with Stripe. Would you like me to generate a summary of their previous interactions?
               </div>
               <div className="p-3 bg-primary text-white rounded-xl rounded-br-none text-xs ml-auto max-w-[90%] font-medium">
                 Yes, please. Also include the latest support tickets from their engineering team.
               </div>
               <div className="relative group pt-4">
                  <Input placeholder="Message Ozofi AI..." className="text-xs h-9 pr-12" />
                  <Button variant="primary" size="icon" className="h-7 w-7 absolute right-1 top-[21px] rounded-md">
                    <ArrowRight size={14} />
                  </Button>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
