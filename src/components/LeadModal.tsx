import * as React from 'react';
import { Modal } from './Modal';
import { Button, Input, Label, Select, Textarea } from './UI';
import { leadService, Lead } from '../services/leadService';
import { useAuth } from '../contexts/AuthContext';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, lead }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: 'Prospect',
    source: 'Direct',
    score: 50,
    notes: '',
  });

  React.useEffect(() => {
    if (lead) {
      setFormData({
        firstName: lead.firstName || '',
        lastName: lead.lastName || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'Prospect',
        source: lead.source || 'Direct',
        score: lead.score || 50,
        notes: lead.notes || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        status: 'Prospect',
        source: 'Direct',
        score: 50,
        notes: '',
      });
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.orgId) return;

    setLoading(true);
    try {
      if (lead?.id) {
        await leadService.updateLead(lead.id, formData);
      } else {
        await leadService.createLead({
          ...formData,
          orgId: profile.orgId,
          ownerId: profile.uid,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'score' ? parseInt(value) : value 
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? 'Edit Lead' : 'Add New Lead'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : lead ? 'Save Changes' : 'Create Lead'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Alice"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Freeman"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alice@company.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Global Tech Inc."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Lead Status</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Prospect">Prospect</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Nurture">Nurture</option>
              <option value="Closed - Won">Closed - Won</option>
              <option value="Closed - Lost">Closed - Lost</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Lead Source</Label>
            <Select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="Direct">Direct</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Web Referral">Web Referral</option>
              <option value="Conference">Conference</option>
              <option value="Cold Email">Cold Email</option>
              <option value="Partner">Partner</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional details or context about this lead..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="score">Lead Score</Label>
            <span className="text-xs font-bold text-primary">{formData.score}%</span>
          </div>
          <input
            id="score"
            name="score"
            type="range"
            min="0"
            max="100"
            value={formData.score}
            onChange={handleChange}
            className="w-full h-2 bg-muted-surface rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </form>
    </Modal>
  );
};
