import * as React from 'react';
import { Card, Button, Input, Badge, Avatar } from '../components/UI';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Sparkles,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Filter,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const THREADS = [
  { id: 1, name: 'Alex Rivers', lastMsg: 'I have reviewed the proposal and it looks good. Can we chat tomorrow?', time: '10:45 AM', unread: 2, status: 'Online', company: 'Stripe' },
  { id: 2, name: 'Sarah Chen', lastMsg: 'Sent the contract for the Enterprise deployment.', time: '9:20 AM', unread: 0, status: 'Offline', company: 'Tesla' },
  { id: 3, name: 'James Wilson', lastMsg: 'Can you introduce me to the product team?', time: 'Yesterday', unread: 0, status: 'Online', company: 'Airbnb' },
  { id: 4, name: 'Fiona Apple', lastMsg: "The API documentation is missing some keys.", time: 'Yesterday', unread: 0, status: 'Offline', company: 'Music Box' },
  { id: 5, name: 'David Gandy', lastMsg: 'Meeting confirmed for next Tuesday.', time: '2 days ago', unread: 0, status: 'Offline', company: 'Acme Corp' },
];

const MESSAGES = [
  { id: 1, sender: 'Alex Rivers', text: 'Hey there! Just checking in on the Series C support package.', time: '10:30 AM', type: 'incoming' },
  { id: 2, sender: 'You', text: 'Hi Alex! It’s ready. We’ve finalized the terms we discussed.', time: '10:35 AM', type: 'outgoing' },
  { id: 3, sender: 'Alex Rivers', text: 'Great. I have reviewed the proposal and it looks good. Can we chat tomorrow?', time: '10:45 AM', type: 'incoming' },
];

export default function Inbox() {
  const [activeThread, setActiveThread] = React.useState(THREADS[0]);

  return (
    <div className="h-[calc(100vh-140px)] flex gap-4 overflow-hidden">
      {/* Thread List */}
      <Card className="w-80 flex flex-col p-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold">Inbox</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
              <Filter size={16} />
            </Button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input placeholder="Search messages..." className="pl-9 h-9 bg-muted-surface border-border text-xs" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {THREADS.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setActiveThread(thread)}
              className={cn(
                "w-full text-left p-4 flex items-start gap-3 transition-colors hover:bg-muted-surface",
                activeThread.id === thread.id && "bg-primary-light/50 border-r-2 border-primary"
              )}
            >
              <div className="relative">
                <Avatar fallback={thread.name[0]} className="w-10 h-10" />
                {thread.status === 'Online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-surface rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-[13px] font-bold text-text-main truncate">{thread.name}</h4>
                  <span className="text-[10px] text-text-muted">{thread.time}</span>
                </div>
                <p className="text-[11px] text-text-muted truncate mb-1">{thread.company}</p>
                <div className="flex justify-between items-center">
                  <p className={cn(
                    "text-[12px] truncate flex-1",
                    thread.unread > 0 ? "text-text-main font-bold" : "text-text-muted"
                  )}>
                    {thread.lastMsg}
                  </p>
                  {thread.unread > 0 && (
                    <Badge variant="primary" className="h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full">
                      {thread.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Conversation Pane */}
      <Card className="flex-1 flex flex-col p-0">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar fallback={activeThread.name[0]} className="w-10 h-10" />
            <div>
              <h3 className="text-sm font-bold text-text-main">{activeThread.name}</h3>
              <p className="text-[11px] text-text-muted">{activeThread.company} • Active {activeThread.time.toLowerCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-text-muted">
              <Phone size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-text-muted">
              <Video size={18} />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-9 w-9 text-text-muted">
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-muted-surface px-2 py-1 rounded">Today</span>
          </div>
          {MESSAGES.map((msg) => (
            <div key={msg.id} className={cn(
              "flex flex-col",
              msg.type === 'outgoing' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed",
                msg.type === 'outgoing' 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-muted-surface text-text-main rounded-tl-none border border-border"
              )}>
                {msg.text}
              </div>
              <div className="flex items-center mt-1.5 gap-1.5 text-[10px] text-text-muted">
                {msg.time}
                {msg.type === 'outgoing' && <CheckCheck size={12} className="text-primary" />}
              </div>
            </div>
          ))}
          
          {/* AI Suggestion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-4"
          >
            <Card className="bg-gradient-to-br from-white to-[#F5F3FF] border border-[#DDD6FE] p-4 max-w-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-ai-accent" />
                <span className="text-[11px] font-bold text-ai-accent uppercase tracking-wider">AI Suggested Reply</span>
              </div>
              <p className="text-xs text-text-main mb-3 italic">
                "Sure Alex, tomorrow at 2 PM work for you? I can bring the product leads as well."
              </p>
              <Button variant="outline" className="w-full text-xs font-bold gap-2 text-ai-accent border-ai-accent/30 hover:bg-ai-accent/5">
                Apply & Send <ArrowRight size={14} />
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="bg-muted-surface rounded-xl border border-border p-2">
            <textarea 
              placeholder="Type your message here..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-2 resize-none h-20 placeholder:text-text-muted"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
                  <Paperclip size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
                  <Smile size={18} />
                </Button>
              </div>
              <Button variant="primary" size="sm" className="gap-2 font-bold px-4">
                <Send size={16} /> Send
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Context Pane (Dynamic Sidebar) */}
      <Card className="w-72 hidden xl:flex flex-col p-4 space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Contact Profile</h3>
          <div className="flex flex-col items-center text-center p-4 bg-muted-surface rounded-xl">
             <Avatar fallback={activeThread.name[0]} className="w-16 h-16 mb-3 text-lg" />
             <h4 className="font-bold text-text-main">{activeThread.name}</h4>
             <p className="text-xs text-text-muted font-medium mb-4">{activeThread.company} • VP Growth</p>
             <div className="flex gap-2">
               <Badge variant="primary" className="h-5 px-1.5 text-[10px]">Decision Maker</Badge>
               <Badge variant="success" className="h-5 px-1.5 text-[10px]">High Intent</Badge>
             </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Open Deals</h3>
          <div className="space-y-3">
             <div className="p-3 bg-surface border border-border rounded-lg hover:border-primary transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[13px] font-bold group-hover:text-primary">Series C Support</p>
                  <Badge variant="primary" className="text-[10px] h-4">Proposal</Badge>
                </div>
                <p className="text-xs font-bold text-text-main">$450,000</p>
             </div>
          </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-primary" />
            <span className="text-[11px] font-bold text-primary uppercase">Contextual Intelligence</span>
          </div>
          <p className="text-xs text-text-main leading-relaxed">
            Alex typically responds within 15 minutes. He usually asks about scalability. Have the technical docs ready.
          </p>
        </div>
      </Card>
    </div>
  );
}
