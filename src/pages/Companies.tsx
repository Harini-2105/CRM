import * as React from 'react';
import { Card, Button, Input, Badge, Avatar } from '../components/UI';
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  Globe, 
  Users, 
  DollarSign, 
  MoreVertical,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const COMPANIES = [
  { id: 1, name: 'Stripe Inc.', domain: 'stripe.com', industry: 'Fintech', size: '1000+', deals: 4, value: '$1.2M', contact: 'Patrick Collison' },
  { id: 2, name: 'Acme Corp', domain: 'acme.co', industry: 'Manufacturing', size: '500-1000', deals: 1, value: '$125k', contact: 'Wile E. Coyote' },
  { id: 3, name: 'Webflow', domain: 'webflow.com', industry: 'SaaS', size: '250-500', deals: 2, value: '$85k', contact: 'Vlad Magdalin' },
  { id: 4, name: 'Figma', domain: 'figma.com', industry: 'Design Tools', size: '500-1000', deals: 3, value: '$450k', contact: 'Dylan Field' },
  { id: 5, name: 'Vercel', domain: 'vercel.com', industry: 'Developer Tools', size: '250-500', deals: 1, value: '$45k', contact: 'Guillermo Rauch' },
  { id: 6, name: 'Tesla', domain: 'tesla.com', industry: 'Automotive', size: '1000+', deals: 0, value: '$0', contact: 'Elon Musk' },
];

export default function Companies() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Target Accounts</h1>
          <p className="text-text-muted">Manage your strategic relationships and enterprise growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">Export</Button>
          <Button variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> New Company
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-border">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            placeholder="Search accounts by name, domain, or industry..." 
            className="pl-10 border-none bg-transparent focus:ring-0 shadow-none"
          />
        </div>
        <div className="h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" className="gap-2 text-text-muted">
          <Filter size={16} /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMPANIES.map((company, i) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6 hover:border-primary/50 transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted-surface border border-border flex items-center justify-center group-hover:bg-primary-light transition-colors">
                    <Building2 size={24} className="text-text-muted group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{company.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Globe size={12} />
                      {company.domain}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-border">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Industry</p>
                  <p className="text-sm font-medium">{company.industry}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Size</p>
                  <p className="text-sm font-medium">{company.size}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Active Deals</p>
                  <p className="text-sm font-bold text-primary">{company.deals} Deals</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Pipeline</p>
                  <p className="text-sm font-bold text-text-main">{company.value}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar fallback={company.contact.split(' ').map(n => n[0]).join('')} className="w-6 h-6" />
                  <span className="text-xs text-text-muted">{company.contact}</span>
                </div>
                {company.deals > 2 && (
                  <Badge variant="success" className="gap-1 px-1.5 h-5 text-[10px]">
                    <ArrowUpRight size={10} /> Growing
                  </Badge>
                )}
              </div>

              <div className="mt-4 hidden group-hover:block transition-all">
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 flex items-center gap-3">
                  <Sparkles size={16} className="text-primary" />
                  <p className="text-xs font-medium text-primary leading-tight">
                    AI suggests expanding into their European division.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
