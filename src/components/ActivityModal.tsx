import * as React from 'react';
import { Modal } from './Modal';
import { Button, Input, Label, Select, Textarea } from './UI';
import { activityService, Activity } from '../services/activityService';
import { useAuth } from '../contexts/AuthContext';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: Activity | null;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, activity }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    type: 'note' as const,
    title: '',
    description: '',
    linkedEntityType: 'lead' as const,
    linkedEntityId: '',
    date: new Date().toISOString().slice(0, 16),
  });

  React.useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type || 'note',
        title: activity.title || '',
        description: activity.description || '',
        linkedEntityType: activity.linkedEntityType || 'lead',
        linkedEntityId: activity.linkedEntityId || '',
        date: activity.date || new Date().toISOString().slice(0, 16),
      });
    } else {
      setFormData({
        type: 'note',
        title: '',
        description: '',
        linkedEntityType: 'lead',
        linkedEntityId: '',
        date: new Date().toISOString().slice(0, 16),
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.orgId) return;

    setLoading(true);
    try {
      if (activity?.id) {
        await activityService.updateActivity(activity.id, formData);
      } else {
        await activityService.createActivity({
          ...formData,
          orgId: profile.orgId,
          ownerId: profile.uid,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activity ? 'Edit Activity' : 'Log Activity'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : activity ? 'Save Changes' : 'Log Activity'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Activity Type</Label>
            <Select id="type" name="type" value={formData.type} onChange={handleChange}>
              <option value="note">Note</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="email">Email</option>
              <option value="task">Task</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Summary / Subject</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Quick catch up with Patrick"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Details</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add some details about the interaction..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedEntityType">Link to</Label>
            <Select id="linkedEntityType" name="linkedEntityType" value={formData.linkedEntityType} onChange={handleChange}>
              <option value="lead">Lead</option>
              <option value="contact">Contact</option>
              <option value="deal">Deal</option>
              <option value="company">Company</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedEntityId">Entity ID (Optional)</Label>
            <Input
              id="linkedEntityId"
              name="linkedEntityId"
              value={formData.linkedEntityId}
              onChange={handleChange}
              placeholder="e.g. lead_123"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
