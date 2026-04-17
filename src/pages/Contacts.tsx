import * as React from 'react';
import { Card, Button, Badge, Avatar, Input } from '../components/UI';
import { 
  Contact, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MessageSquare, 
  MoreVertical, 
  Plus, 
  MapPin, 
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

const CONTACTS = [
  { id: 1, name: 'Alice Freeman', company: 'Global Tech', role: 'CTO', email: 'alice@global.tech', phone: '+1 (555) 012-3456', stage: 'Decision Maker', country: 'USA' },
  { id: 2, name: 'Eric Chen', company: 'Infinite Scale', role: 'Head of Growth', email: 'eric@infinite.io', phone: '+1 (555) 987-6543', stage: 'Influencer', country: 'Canada' },
  { id: 3, name: 'Sarah Miller', company: 'Starlight', role: 'Operations Director', email: 'sarah@starlight.co', phone: '+1 (555) 111-2222', stage: 'Champion', country: 'UK' },
  { id: 4, name: 'David Wilson', company: 'Vercel', role: 'Engineering Lead', email: 'dave@vercel.com', phone: '+1 (555) 333-4444', stage: 'User', country: 'USA' },
];

export default function Contacts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Contacts</h1>
          <p className="text-text-secondary">Keep track of every person in your professional network.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Import</Button>
          <Button variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Add Contact
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <Input placeholder="Find a contact..." className="pl-10 h-10 w-full" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button variant="outline" size="sm" className="gap-2 shrink-0">
            <Filter size={16} /> Filters
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Badge variant="primary" className="cursor-pointer hover:opacity-80 shrink-0">Customers</Badge>
          <Badge variant="neutral" className="cursor-pointer hover:opacity-80 shrink-0">Prospects</Badge>
          <Badge variant="neutral" className="cursor-pointer hover:opacity-80 shrink-0">Leads</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {CONTACTS.map((contact) => (
          <Card key={contact.id} className="p-5 hover:border-primary/50 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <Avatar fallback={contact.name.split(' ').map(n=>n[0]).join('')} className="h-12 w-12" />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary">
                <MoreVertical size={16} />
              </Button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold text-lg text-text-strong group-hover:text-primary transition-colors">{contact.name}</h4>
              <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                <Briefcase size={10} /> {contact.role}
              </p>
              <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5 font-bold">
                <Building2 size={10} /> {contact.company}
              </p>
            </div>

            <div className="space-y-2 mb-6">
               <div className="flex items-center gap-2 text-xs text-text-secondary">
                 <Mail size={12} />
                 <span>{contact.email}</span>
               </div>
               <div className="flex items-center gap-2 text-xs text-text-secondary">
                 <Phone size={12} />
                 <span>{contact.phone}</span>
               </div>
               <div className="flex items-center gap-2 text-xs text-text-secondary">
                 <MapPin size={12} />
                 <span>{contact.country}</span>
               </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
               <Badge variant="primary" className="text-[10px] font-bold">{contact.stage}</Badge>
               <div className="flex gap-1">
                 <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted-surface hover:bg-primary/10 hover:text-primary rounded-full">
                   <Mail size={14} />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted-surface hover:bg-primary/10 hover:text-primary rounded-full">
                   <Phone size={14} />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted-surface hover:bg-primary/10 hover:text-primary rounded-full">
                   <ChevronRight size={14} />
                 </Button>
               </div>
            </div>
          </Card>
        ))}
        
        <Button variant="ghost" className="h-auto min-h-[280px] flex flex-col items-center justify-center gap-4 bg-muted-surface/50 border-2 border-dashed border-border rounded-xl text-text-secondary hover:bg-surface hover:border-primary/50 transition-all">
          <div className="h-12 w-12 rounded-full bg-surface border border-border flex items-center justify-center">
            <Plus size={24} className="text-text-secondary" />
          </div>
          <span className="font-bold">Add New Contact</span>
        </Button>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-bold mb-4">Suggested Contacts</h3>
        <Card className="p-4 bg-accent/5 border-accent/20">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                 <Sparkles size={24} />
              </div>
              <div className="flex-1">
                 <h4 className="font-bold text-accent">AI identified 3 new key stakeholders</h4>
                 <p className="text-sm text-text-secondary">Based on recent email threads from Acme Corp, I've identified these people should be in your CRM.</p>
              </div>
              <Button size="sm" variant="primary" className="bg-accent hover:bg-accent/90">Review All</Button>
           </div>
        </Card>
      </div>
    </div>
  );
}
