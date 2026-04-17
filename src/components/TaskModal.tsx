import * as React from 'react';
import { Modal } from './Modal';
import { Button, Input, Label, Select, Textarea } from './UI';
import { taskService, Task } from '../services/taskService';
import { useAuth } from '../contexts/AuthContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending' as const,
    linkedEntityType: 'lead',
    linkedEntityId: '',
  });

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        status: task.status || 'pending',
        linkedEntityType: task.linkedEntityType || 'lead',
        linkedEntityId: task.linkedEntityId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending',
        linkedEntityType: 'lead',
        linkedEntityId: '',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.orgId) return;

    setLoading(true);
    try {
      if (task?.id) {
        await taskService.updateTask(task.id, formData);
      } else {
        await taskService.createTask({
          ...formData,
          orgId: profile.orgId,
          assigneeId: profile.uid,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
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
      title={task ? 'Edit Task' : 'Add New Task'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Follow up with client"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add some details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
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
              placeholder="e.g. doc_id_123"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
