import * as React from 'react';
import { Card, Button, Input, Badge, Avatar } from '../components/UI';
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  Globe, 
  MoreVertical,
  ArrowUpRight,
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { companyService, Company } from '../services/companyService';
import { CompanyModal } from '../components/CompanyModal';

export default function Companies() {
  const { profile } = useAuth();
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = companyService.subscribeToCompanies(profile.orgId, (fetchedCompanies) => {
      setCompanies(fetchedCompanies);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.orgId]);

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      await companyService.deleteCompany(id);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Target Accounts</h1>
          <p className="text-text-muted">Manage your strategic relationships and enterprise growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">Export</Button>
          <Button variant="primary" size="sm" className="gap-2" onClick={openAddModal}>
            <Plus size={16} /> New Company
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-border">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            placeholder="Search accounts by name, domain, or industry..." 
            className="pl-10 border-none bg-transparent focus:ring-0 shadow-none h-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" className="gap-2 text-text-muted">
          <Filter size={16} /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-text-muted">Loading accounts...</div>
        ) : filteredCompanies.length > 0 ? (
          filteredCompanies.map((company, i) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-6 hover:border-primary/50 transition-all group cursor-pointer relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4" onClick={() => handleEdit(company)}>
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
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary" onClick={(e) => { e.stopPropagation(); handleEdit(company); }}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(company.id!); }}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-border" onClick={() => handleEdit(company)}>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Industry</p>
                    <p className="text-sm font-medium">{company.industry || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Size</p>
                    <p className="text-sm font-medium">{company.size || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
                   <Badge variant="primary" className="text-[10px] font-bold uppercase tracking-widest">Account</Badge>
                   <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest gap-1 hover:text-primary" onClick={() => handleEdit(company)}>
                      Details <ArrowUpRight size={12} />
                   </Button>
                </div>

                <div className="mt-4 hidden group-hover:block transition-all">
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 flex items-center gap-3">
                    <Sparkles size={16} className="text-primary" />
                    <p className="text-xs font-medium text-primary leading-tight">
                      AI suggests expanding enterprise relationship.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-text-muted border border-dashed border-border rounded-xl">
            No accounts found. Create your first strategic target.
          </div>
        )}
      </div>

      <CompanyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        company={selectedCompany} 
      />
    </div>
  );
}
