import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Contact, 
  Building2, 
  Briefcase, 
  Inbox, 
  Calendar, 
  CheckSquare, 
  GitBranch, 
  BarChart3, 
  Sparkles, 
  FileText, 
  Users2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Plus,
  Bell,
  Search,
  Zap,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button, Avatar, Input } from './UI';
import { motion, AnimatePresence } from 'motion/react';

const NAV_GROUPS = [
  {
    label: 'Sales',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Leads', icon: Zap, path: '/leads' },
      { name: 'Contacts', icon: Contact, path: '/contacts' },
      { name: 'Companies', icon: Building2, path: '/companies' },
      { name: 'Deals', icon: Briefcase, path: '/deals' },
    ]
  },
  {
    label: 'Work',
    items: [
      { name: 'Inbox', icon: Inbox, path: '/inbox' },
      { name: 'Activities', icon: Calendar, path: '/activities' },
      { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
      { name: 'Documents', icon: FileText, path: '/documents' },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'Reports', icon: BarChart3, path: '/reports' },
      { name: 'Workflows', icon: GitBranch, path: '/workflows' },
      { name: 'AI Insights', icon: Sparkles, path: '/insights' },
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Team', icon: Users2, path: '/team' },
      { name: 'Settings', icon: Settings, path: '/settings' },
    ]
  }
];

export const Sidebar = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (c: boolean) => void }) => {
  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 240 }}
      className="h-screen bg-surface border-r border-border flex flex-col sticky top-0 z-50 overflow-hidden py-6"
    >
      <div className="px-6 pb-8 flex items-center justify-between">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="font-display font-bold text-xl text-text-main tracking-tight">Ozofi CRM</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
             <span className="text-white font-bold text-lg">O</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-0 py-0 space-y-6 scrollbar-hide">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-0">
            {!collapsed && (
              <h3 className="px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                {group.label}
              </h3>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-6 py-2.5 transition-all text-sm font-medium',
                  'hover:text-primary group relative',
                  isActive ? 'bg-primary-light text-primary border-r-[3px] border-primary' : 'text-text-muted'
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={cn(
                      'transition-colors',
                      isActive ? 'text-primary' : 'text-text-muted/70 group-hover:text-primary'
                    )} />
                    {!collapsed && <span>{item.name}</span>}
                    {collapsed && (
                      <div className="absolute left-full ml-6 px-2 py-1 bg-text-main text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-6 pt-4 border-t border-border mt-auto">
        <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
          <div className="w-8 h-8 rounded-full bg-border shrink-0" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-text-main truncate">Jane Doe</p>
              <p className="text-[11px] text-text-muted truncate">jane@ozofi.com</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const Header = ({ title }: { title: string }) => {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-md hidden lg:block">
        <div className="relative group">
          <Input 
            placeholder="Search leads, deals, or commands..." 
            className="h-9 bg-muted-surface border-border focus:bg-surface focus:border-border text-xs px-4 rounded-lg placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="flex-1 flex justify-center md:hidden">
        <h2 className="text-base font-bold">{title}</h2>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-ai-accent bg-[#F5F3FF] px-3 py-1.5 rounded-full border border-[#DDD6FE]">
          <Sparkles size={14} className="fill-ai-accent" />
          AI Co-pilot Active
        </div>
        <Button variant="primary" size="sm" className="h-9 px-4 rounded-lg font-bold">
          + Create New
        </Button>
      </div>
    </header>
  );
};

export const AppShell = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-muted-surface">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="p-6 flex-1 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
