import * as React from 'react';
import { Modal } from './Modal';
import { Button, Input, Label, Select } from './UI';
import { companyService, Company } from '../services/companyService';
import { useAuth } from '../contexts/AuthContext';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, company }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    domain: '',
    industry: '',
    size: '1-10',
  });

  React.useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        domain: company.domain || '',
        industry: company.industry || '',
        size: company.size || '1-10',
      });
    } else {
      setFormData({
        name: '',
        domain: '',
        industry: '',
        size: '1-10',
      });
    }
  }, [company, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.orgId) return;

    setLoading(true);
    try {
      if (company?.id) {
        await companyService.updateCompany(company.id, formData);
      } else {
        await companyService.createCompany({
          ...formData,
          orgId: profile.orgId,
          ownerId: profile.uid,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={company ? 'Edit Company' : 'Add New Company'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : company ? 'Save Changes' : 'Create Company'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            placeholder="e.g. acme.com"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g. Software"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Select id="size" name="size" value={formData.size} onChange={handleChange}>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </Select>
          </div>
        </div>
      </form>
    </Modal>
  );
};
