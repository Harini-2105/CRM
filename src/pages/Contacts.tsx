import * as React from 'react';
import { Card, Button, Badge, Avatar, Input } from '../components/UI';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MoreVertical, 
  Plus, 
  MapPin, 
  Briefcase,
  Building2,
  ChevronRight,
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { contactService, Contact } from '../services/contactService';
import { ContactModal } from '../components/ContactModal';

export default function Contacts() {
  const { profile } = useAuth();
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = contactService.subscribeToContacts(profile.orgId, (fetchedContacts) => {
      setContacts(fetchedContacts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.orgId]);

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await contactService.deleteContact(id);
    }
  };

  const filteredContacts = contacts.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Contacts</h1>
          <p className="text-text-secondary">Keep track of every person in your professional network.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Import</Button>
          <Button variant="primary" size="sm" className="gap-2" onClick={openAddModal}>
            <Plus size={16} /> Add Contact
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <Input 
            placeholder="Find a contact..." 
            className="pl-10 h-10 w-full" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        {loading ? (
          <div className="col-span-full py-12 text-center text-text-muted">Loading contacts...</div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5 hover:border-primary/50 transition-all cursor-pointer group relative">
                <div className="flex justify-between items-start mb-4">
                  <Avatar fallback={`${contact.firstName[0]}${contact.lastName[0]}`} className="h-12 w-12" />
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-primary" onClick={(e) => { e.stopPropagation(); handleEdit(contact); }}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(contact.id!); }}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4" onClick={() => handleEdit(contact)}>
                  <h4 className="font-bold text-lg text-text-strong group-hover:text-primary transition-colors">{contact.firstName} {contact.lastName}</h4>
                  <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                    <Briefcase size={10} /> {contact.jobTitle || 'No Title'}
                  </p>
                  <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5 font-bold">
                    <Building2 size={10} /> {contact.companyId || 'Independent'}
                  </p>
                </div>

                <div className="space-y-2 mb-6" onClick={() => handleEdit(contact)}>
                   <div className="flex items-center gap-2 text-xs text-text-secondary">
                     <Mail size={12} />
                     <span className="truncate">{contact.email}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-text-secondary">
                     <Phone size={12} />
                     <span>{contact.phone || 'No phone'}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                   <Badge variant="primary" className="text-[10px] font-bold">Contact</Badge>
                   <div className="flex gap-1">
                     <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted-surface hover:bg-primary/10 hover:text-primary rounded-full" onClick={(e) => e.stopPropagation()}>
                       <Mail size={14} />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted-surface hover:bg-primary/10 hover:text-primary rounded-full" onClick={(e) => e.stopPropagation()}>
                       <Phone size={14} />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted-surface hover:bg-primary/10 hover:text-primary rounded-full" onClick={() => handleEdit(contact)}>
                       <ChevronRight size={14} />
                     </Button>
                   </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-text-muted">No contacts found.</div>
        )}
        
        <Button 
          variant="ghost" 
          className="h-auto min-h-[280px] flex flex-col items-center justify-center gap-4 bg-muted-surface/50 border-2 border-dashed border-border rounded-xl text-text-secondary hover:bg-surface hover:border-primary/50 transition-all"
          onClick={openAddModal}
        >
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
                 <p className="text-sm text-text-secondary">Based on recent email threads, I've identified these people should be in your CRM.</p>
              </div>
              <Button size="sm" variant="primary" className="bg-accent hover:bg-accent/90">Review All</Button>
           </div>
        </Card>
      </div>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        contact={selectedContact} 
      />
    </div>
  );
}
