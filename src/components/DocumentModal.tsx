import * as React from 'react';
import { Modal } from './Modal';
import { Button, Input, Label, Select } from './UI';
import { documentService, DocumentRecord } from '../services/documentService';
import { useAuth } from '../contexts/AuthContext';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentRecord | null;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, document }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'pdf',
    size: '0 KB',
    status: 'Draft' as const,
    url: '',
    linkedEntityType: 'deal' as const,
    linkedEntityId: '',
  });

  React.useEffect(() => {
    if (document) {
      setFormData({
        name: document.name || '',
        type: document.type || 'pdf',
        size: document.size || '0 KB',
        status: document.status || 'Draft',
        url: document.url || '',
        linkedEntityType: document.linkedEntityType || 'deal',
        linkedEntityId: document.linkedEntityId || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'pdf',
        size: '0 KB',
        status: 'Draft',
        url: '',
        linkedEntityType: 'deal',
        linkedEntityId: '',
      });
    }
  }, [document, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.orgId) return;

    setLoading(true);
    try {
      if (document?.id) {
        await documentService.updateDocument(document.id, formData);
      } else {
        await documentService.createDocument({
          ...formData,
          orgId: profile.orgId,
          ownerId: profile.uid,
          ownerName: profile.firstName + ' ' + profile.lastName,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save document:', error);
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
      title={document ? 'Edit Document Info' : 'Upload Document'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : document ? 'Save Changes' : 'Upload'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Document Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sales Proposal Q4.pdf"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">File Type</Label>
            <Select id="type" name="type" value={formData.type} onChange={handleChange}>
              <option value="pdf">PDF</option>
              <option value="docx">Word</option>
              <option value="xlsx">Excel</option>
              <option value="pptx">PowerPoint</option>
              <option value="image">Image</option>
              <option value="link">External Link</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Draft">Draft</option>
              <option value="Review">In Review</option>
              <option value="Final">Final</option>
              <option value="Archived">Archived</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Document URL / Link</Label>
          <Input
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://..."
            required={formData.type === 'link'}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedEntityType">Link to</Label>
            <Select id="linkedEntityType" name="linkedEntityType" value={formData.linkedEntityType} onChange={handleChange}>
              <option value="deal">Deal</option>
              <option value="lead">Lead</option>
              <option value="contact">Contact</option>
              <option value="company">Company</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedEntityId">Entity ID</Label>
            <Input
              id="linkedEntityId"
              name="linkedEntityId"
              value={formData.linkedEntityId}
              onChange={handleChange}
              placeholder="e.g. deal_xyz"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
