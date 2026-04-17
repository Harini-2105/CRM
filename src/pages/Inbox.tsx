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
  CheckCheck,
  Filter,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { messageService, Thread, Message } from '../services/messageService';

export default function Inbox() {
  const { profile } = useAuth();
  const [threads, setThreads] = React.useState<Thread[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [activeThread, setActiveThread] = React.useState<Thread | null>(null);
  const [newMessage, setNewMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = messageService.subscribeToThreads(profile.orgId, (fetchedThreads) => {
      setThreads(fetchedThreads);
      if (fetchedThreads.length > 0 && !activeThread) {
        setActiveThread(fetchedThreads[0]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.orgId]);

  React.useEffect(() => {
    if (!activeThread?.id) return;

    const unsubscribe = messageService.subscribeToMessages(activeThread.id, (fetchedMessages) => {
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [activeThread?.id]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activeThread?.id || !profile) return;

    const msgText = newMessage;
    setNewMessage('');

    try {
      await messageService.sendMessage({
        threadId: activeThread.id,
        senderId: profile.uid,
        senderName: profile.firstName || 'User',
        text: msgText,
        type: 'outgoing',
        orgId: profile.orgId
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(msgText);
    }
  };

  if (!profile) return null;

  return (
    <div className="h-[calc(100vh-140px)] flex gap-4 overflow-hidden">
      {/* Thread List */}
      <Card className="w-80 flex flex-col p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold">Inbox</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
              <Filter size={16} />
            </Button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input placeholder="Search messages..." className="pl-9 h-9 bg-muted-surface border-border text-xs w-full" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-text-muted text-xs">Loading conversations...</div>
          ) : threads.length > 0 ? (
            threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className={cn(
                  "w-full text-left p-4 flex items-start gap-3 transition-colors hover:bg-muted-surface",
                  activeThread?.id === thread.id && "bg-primary-light/50 border-r-2 border-primary"
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
                    <span className="text-[10px] text-text-muted">
                      {thread.lastMsgAt ? new Date(thread.lastMsgAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted truncate mb-1">{thread.company}</p>
                  <div className="flex justify-between items-center">
                    <p className={cn(
                      "text-[12px] truncate flex-1",
                      thread.unreadCount > 0 ? "text-text-main font-bold" : "text-text-muted"
                    )}>
                      {thread.lastMsg}
                    </p>
                    {thread.unreadCount > 0 && (
                      <Badge variant="primary" className="h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full">
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-text-muted text-xs space-y-2">
              <p>No messages yet.</p>
              <Button size="sm" variant="outline" className="text-[10px] h-7">Start a Chat</Button>
            </div>
          )}
        </div>
      </Card>

      {/* Conversation Pane */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden">
        {activeThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar fallback={activeThread.name[0]} className="w-10 h-10" />
                <div>
                  <h3 className="text-sm font-bold text-text-main">{activeThread.name}</h3>
                  <p className="text-[11px] text-text-muted">{activeThread.company} • Active {activeThread.status.toLowerCase()}</p>
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
              {messages.map((msg) => {
                const isOutgoing = msg.senderId === profile.uid;
                return (
                  <div key={msg.id} className={cn(
                    "flex flex-col",
                    isOutgoing ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                      isOutgoing 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-muted-surface text-text-main rounded-tl-none border border-border"
                    )}>
                      {msg.text}
                    </div>
                    <div className="flex items-center mt-1.5 gap-1.5 text-[10px] text-text-muted">
                      {msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      {isOutgoing && <CheckCheck size={12} className="text-primary" />}
                    </div>
                  </div>
                );
              })}
              
              {/* AI Suggestion (Only if last message is incoming) */}
              {messages.length > 0 && messages[messages.length - 1].senderId !== profile.uid && (
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
                      "Thanks for reaching out. I'll review this and get back to you shortly."
                    </p>
                    <Button variant="outline" className="w-full text-xs font-bold gap-2 text-ai-accent border-ai-accent/30 hover:bg-ai-accent/5" onClick={() => { setNewMessage("Thanks for reaching out. I'll review this and get back to you shortly."); }}>
                      Apply Suggestion
                    </Button>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <form className="p-4 border-t border-border" onSubmit={handleSendMessage}>
              <div className="bg-muted-surface rounded-xl border border-border p-2">
                <textarea 
                  placeholder="Type your message here..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm p-2 resize-none h-20 placeholder:text-text-muted"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
                      <Paperclip size={18} />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
                      <Smile size={18} />
                    </Button>
                  </div>
                  <Button type="submit" variant="primary" size="sm" className="gap-2 font-bold px-4" disabled={!newMessage.trim()}>
                    <Send size={16} /> Send
                  </Button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted p-6 text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted-surface flex items-center justify-center">
              <MessageSquare size={40} className="text-text-muted/50" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main">No conversation selected</h3>
              <p className="text-sm">Select a thread from the left or start a new interaction.</p>
            </div>
          </div>
        )}
      </Card>

      {/* Context Pane */}
      <Card className={cn(
        "w-72 flex-col p-4 space-y-6 overflow-y-auto hidden",
        activeThread && "xl:flex"
      )}>
        {activeThread && (
          <>
            <div>
              <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Contact Profile</h3>
              <div className="flex flex-col items-center text-center p-4 bg-muted-surface rounded-xl border border-border/50">
                 <Avatar fallback={activeThread.name[0]} className="w-16 h-16 mb-3 text-lg shadow-sm" />
                 <h4 className="font-bold text-text-main">{activeThread.name}</h4>
                 <p className="text-xs text-text-muted font-medium mb-4">{activeThread.company}</p>
                 <div className="flex flex-wrap justify-center gap-1">
                   <Badge variant="primary" className="h-5 px-1.5 text-[9px]">Decision Maker</Badge>
                   <Badge variant="success" className="h-5 px-1.5 text-[9px]">Active Hub</Badge>
                 </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Recent Engagement</h3>
              <div className="space-y-3">
                 <div className="p-3 bg-surface border border-border rounded-lg hover:border-primary transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[12px] font-bold group-hover:text-primary">Pipeline Activity</p>
                      <Badge variant="primary" className="text-[9px] h-4">High</Badge>
                    </div>
                    <p className="text-[10px] text-text-muted">Last seen: {activeThread.time || 'Today'}</p>
                 </div>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-primary" />
                <span className="text-[11px] font-bold text-primary uppercase tracking-tighter">AI Context</span>
              </div>
              <p className="text-[11px] text-text-main leading-relaxed">
                This account is currently in the growth phase. Suggest a technical sync call.
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

import { MessageSquare } from 'lucide-react';
