import * as React from 'react';
import { Modal } from './Modal';
import { Button, Input, Label, Select, Textarea } from './UI';
import { workflowService, Workflow } from '../services/workflowService';
import { useAuth } from '../contexts/AuthContext';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow?: Workflow | null;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({ isOpen, onClose, workflow }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    trigger: 'status_change',
    action: 'send_email',
    status: 'active' as const,
  });

  React.useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name || '',
        description: workflow.description || '',
        trigger: workflow.trigger || 'status_change',
        action: workflow.action || 'send_email',
        status: workflow.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        trigger: 'status_change',
        action: 'send_email',
        status: 'active',
      });
    }
  }, [workflow, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.orgId) return;

    setLoading(true);
    try {
      if (workflow?.id) {
        await workflowService.updateWorkflow(workflow.id, formData);
      } else {
        await workflowService.createWorkflow({
          ...formData,
          orgId: profile.orgId,
          ownerId: profile.uid,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save workflow:', error);
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
      title={workflow ? 'Edit Workflow' : 'Create Automation'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : workflow ? 'Save Changes' : 'Activate Workflow'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Workflow Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Lead Follow-up Sequence"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What does this automation do?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trigger">Trigger Event</Label>
            <Select id="trigger" name="trigger" value={formData.trigger} onChange={handleChange}>
              <option value="status_change">Deal Status Changed</option>
              <option value="lead_created">New Lead Created</option>
              <option value="task_completed">Task Completed</option>
              <option value="inactivity">Inactivity Period</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="action">Resulting Action</Label>
            <Select id="action" name="action" value={formData.action} onChange={handleChange}>
              <option value="send_email">Send Email Template</option>
              <option value="create_task">Create Follow-up Task</option>
              <option value="update_field">Update Record Field</option>
              <option value="notify_slack">Notify Team Member</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </Select>
        </div>
      </form>
    </Modal>
  );
};
