import * as React from 'react';
import { Card, Button, Input, Badge, Avatar, Label, Select } from '../components/UI';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Zap, 
  Sparkles,
  ChevronRight,
  Cloud,
  Slack,
  Mail,
  Save,
  Rocket
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

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
  const { profile, organization, updateProfile, updateOrganization } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [loading, setLoading] = React.useState(false);

  // Profile Form State
  const [profileData, setProfileData] = React.useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    displayName: profile?.displayName || '',
    phoneNumber: profile?.phoneNumber || '',
  });

  // Org Form State
  const [orgData, setOrgData] = React.useState({
    name: organization?.name || '',
    domain: organization?.domain || '',
  });

  React.useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        displayName: profile.displayName || '',
        phoneNumber: profile.phoneNumber || '',
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (organization) {
      setOrgData({
        name: organization.name || '',
        domain: organization.domain || '',
      });
    }
  }, [organization]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        ...profileData,
        displayName: `${profileData.firstName} ${profileData.lastName}`
      });
      alert('Profile updated successfully');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateOrganization(orgData);
      alert('Organization settings updated');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      {/* Sidebar Nav */}
      <div className="lg:w-64 flex flex-row lg:flex-col space-y-0 lg:space-y-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide shrink-0">
        <h2 className="hidden lg:block px-4 text-[11px] font-bold uppercase tracking-widest text-text-muted mb-4 mt-2">Personal</h2>
        <button
           onClick={() => setActiveTab('profile')}
           className={cn(
             "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
             activeTab === 'profile' ? "bg-white shadow-sm text-primary" : "text-text-muted hover:bg-white/50"
           )}
        >
          <User size={18} /> Profile
        </button>
        
        <h2 className="hidden lg:block px-4 text-[11px] font-bold uppercase tracking-widest text-text-muted mb-4 mt-6">Workspace</h2>
        {SECTIONS.slice(1).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
               "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group whitespace-nowrap",
               activeTab === item.id ? "bg-white shadow-sm text-primary" : "text-text-muted hover:bg-white/50"
            )}
          >
            <item.icon size={18} className={cn(activeTab === item.id ? "text-primary" : "text-text-muted group-hover:text-primary")} />
            {item.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-display font-bold">Personal Profile</h1>
                <p className="text-sm text-text-muted">Manage your public presence and contact information.</p>
              </div>

              <Card className="p-8">
                 <div className="flex items-center gap-6 mb-8">
                    <Avatar fallback={profile?.displayName?.[0] || 'U'} className="w-20 h-20 text-2xl" />
                    <div>
                       <Button variant="outline" size="sm">Change Photo</Button>
                       <p className="text-xs text-text-muted mt-2">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                 </div>

                 <form onSubmit={handleProfileSave} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label>Email Address</Label>
                       <Input value={profile?.email} disabled className="bg-muted-surface/50 opacity-70" />
                       <p className="text-[10px] text-text-muted">Email management is handled via Google SSO.</p>
                    </div>
                    <div className="space-y-2">
                       <Label>Phone Number</Label>
                       <Input value={profileData.phoneNumber} onChange={e => setProfileData({...profileData, phoneNumber: e.target.value})} placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="pt-4 flex justify-end">
                       <Button variant="primary" className="gap-2 px-8" type="submit" disabled={loading}>
                          <Save size={16} /> {loading ? 'Saving...' : 'Save Profile'}
                       </Button>
                    </div>
                 </form>
              </Card>
            </motion.div>
          )}

          {activeTab === 'organization' && (
            <motion.div
              key="organization"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-display font-bold">Organization Settings</h1>
                <p className="text-sm text-text-muted">Configure workspace-wide parameters and identity.</p>
              </div>

              <Card className="p-8">
                 <form onSubmit={handleOrgSave} className="space-y-6">
                    <div className="space-y-2">
                       <Label>Workspace Name</Label>
                       <Input value={orgData.name} onChange={e => setOrgData({...orgData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <Label>Custom Domain</Label>
                       <div className="flex gap-2">
                          <Input value={orgData.domain} onChange={e => setOrgData({...orgData, domain: e.target.value})} placeholder="acme.ozofi.app" />
                          <Button variant="outline">Verify</Button>
                       </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                       <Button variant="primary" className="gap-2 px-8" type="submit" disabled={loading}>
                          <Save size={16} /> {loading ? 'Saving...' : 'Save Workspace'}
                       </Button>
                    </div>
                 </form>
              </Card>

              <Card className="p-6 border-warning/20 bg-warning/5">
                 <div className="flex gap-4">
                    <Shield className="text-warning" size={24} />
                    <div>
                       <h4 className="text-sm font-bold text-text-main">Danger Zone</h4>
                       <p className="text-xs text-text-muted mt-1">Deleting your organization is permanent and will remove all telemetry data.</p>
                       <Button variant="ghost" className="text-danger mt-4 h-8 px-0 text-xs font-bold">Request Deletion</Button>
                    </div>
                 </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'intelligence' && (
            <motion.div
              key="intelligence"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
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
            </motion.div>
          )}

          {['notifications', 'security', 'billing', 'integrations'].includes(activeTab) && (
             <motion.div
               key={activeTab}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="h-full flex flex-col items-center justify-center text-center py-20"
             >
                <div className="w-16 h-16 rounded-2xl bg-muted-surface flex items-center justify-center text-text-muted mb-6">
                   <Rocket size={32} />
                </div>
                <h3 className="text-lg font-bold">Module Coming Soon</h3>
                <p className="text-sm text-text-muted max-w-xs mt-2">The {activeTab} control panel is under final security review and will be available shortly.</p>
                <Button variant="outline" className="mt-6" onClick={() => setActiveTab('profile')}>Return to Profile</Button>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
