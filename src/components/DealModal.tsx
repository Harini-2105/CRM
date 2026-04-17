import * as React from 'react';
import { Modal } from './Modal';
import { Button, Input, Label, Select } from './UI';
import { dealService, Deal } from '../services/dealService';
import { useAuth } from '../contexts/AuthContext';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: Deal | null;
}

export const DealModal: React.FC<DealModalProps> = ({ isOpen, onClose, deal }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    value: 0,
    currency: 'USD',
    pipelineId: 'sales',
    stageId: 'discovery',
    status: 'open' as const,
    contactId: '',
    companyId: '',
  });

  React.useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        value: deal.value || 0,
        currency: deal.currency || 'USD',
        pipelineId: deal.pipelineId || 'sales',
        stageId: deal.stageId || 'discovery',
        status: deal.status || 'open',
        contactId: deal.contactId || '',
        companyId: deal.companyId || '',
      });
    } else {
      setFormData({
        title: '',
        value: 0,
        currency: 'USD',
        pipelineId: 'sales',
        stageId: 'discovery',
        status: 'open',
        contactId: '',
        companyId: '',
      });
    }
  }, [deal, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.orgId) return;

    setLoading(true);
    try {
      if (deal?.id) {
        await dealService.updateDeal(deal.id, formData);
      } else {
        await dealService.createDeal({
          ...formData,
          orgId: profile.orgId,
          ownerId: profile.uid,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'value' ? parseFloat(value) : value 
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? 'Edit Deal' : 'Add New Deal'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : deal ? 'Save Changes' : 'Create Deal'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Deal Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Enterprise License"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              name="value"
              type="number"
              value={formData.value}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stageId">Pipeline Stage</Label>
            <Select
              id="stageId"
              name="stageId"
              value={formData.stageId}
              onChange={handleChange}
            >
              <option value="discovery">Discovery</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closing">Closing</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="open">Open</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactId">Related Contact (ID)</Label>
            <Input
              id="contactId"
              name="contactId"
              value={formData.contactId}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyId">Related Company (ID)</Label>
            <Input
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
