import * as React from 'react';
import { Card, Button, Input, Badge, Avatar } from '../components/UI';
import { 
  Search, 
  Upload, 
  Plus, 
  FileText, 
  File, 
  Image as ImageIcon, 
  MoreVertical, 
  Download, 
  Share2,
  Trash2,
  Folder,
  ChevronRight,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  List,
  Edit2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { documentService, DocumentRecord } from '../services/documentService';
import { DocumentModal } from '../components/DocumentModal';

const FileIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'pdf': return <div className="p-2 bg-red-50 text-red-600 rounded-lg"><FileText size={20} /></div>;
    case 'docx': case 'doc': return <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><File size={20} /></div>;
    case 'xlsx': case 'xls': case 'csv': return <div className="p-2 bg-green-50 text-green-600 rounded-lg"><File size={20} /></div>;
    case 'pptx': case 'ppt': return <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><ImageIcon size={20} /></div>;
    case 'image': case 'png': case 'jpg': return <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ImageIcon size={20} /></div>;
    case 'link': return <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><ExternalLink size={20} /></div>;
    default: return <div className="p-2 bg-muted-surface text-text-muted rounded-lg"><File size={20} /></div>;
  }
};

export default function Documents() {
  const { profile } = useAuth();
  const [view, setView] = React.useState('grid');
  const [documents, setDocuments] = React.useState<DocumentRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<DocumentRecord | null>(null);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = documentService.subscribeToDocuments(profile.orgId, (fetchedDocs) => {
      setDocuments(fetchedDocs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.orgId]);

  const handleEdit = (doc: DocumentRecord) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document record?')) {
      await documentService.deleteDocument(id);
    }
  };

  const filteredDocuments = documents.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.linkedEntityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Document Hub</h1>
          <p className="text-text-muted">High-value assets, proposals, and legal documents for every account.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-1 bg-border/20 rounded-lg flex items-center mr-2">
            <Button 
                variant={view === 'grid' ? 'primary' : 'ghost'} 
                size="sm" 
                className="h-8 w-8 p-0 rounded-md"
                onClick={() => setView('grid')}
            >
                <LayoutGrid size={16} />
            </Button>
            <Button 
                variant={view === 'list' ? 'primary' : 'ghost'} 
                size="sm" 
                className="h-8 w-8 p-0 rounded-md"
                onClick={() => setView('list')}
            >
                <List size={16} />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Folder size={16} /> New Folder
          </Button>
          <Button variant="primary" size="sm" className="gap-2 font-bold px-4" onClick={openAddModal}>
            <Upload size={16} /> Upload Asset
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-border">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            placeholder="Search documents by name, category, or account..." 
            className="pl-10 border-none bg-transparent focus:ring-0 shadow-none text-sm h-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-1.5 px-3">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mr-2">Quick Browse:</span>
          {['Sales Decks', 'Legal', 'Product', 'Media'].map((tag) => (
            <Badge key={tag} className="cursor-pointer hover:bg-primary-light hover:text-primary transition-colors h-6 px-2.5 bg-muted-surface text-text-muted border-none font-bold text-[10px] uppercase tracking-wider">{tag}</Badge>
          ))}
        </div>
      </div>

      <div className={cn(
        "grid gap-6",
        view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
      )}>
        {loading ? (
          <div className="col-span-full py-12 text-center text-text-muted">Loading assets...</div>
        ) : filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={cn(
                "p-0 hover:border-primary transition-all group cursor-pointer relative flex h-full",
                view === 'grid' ? "flex-col" : "flex-row items-center px-4 py-3"
              )}>
                 <div className={cn("p-6 flex-1", view === 'list' && "p-2 flex-row flex items-center gap-4 flex-1")}>
                   <div className={cn("flex items-start justify-between mb-6", view === 'list' && "mb-0")}>
                      <FileIcon type={doc.type} />
                      {view === 'grid' && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary" onClick={(e) => { e.stopPropagation(); handleEdit(doc); }}>
                            <Edit2 size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id!); }}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      )}
                   </div>
                   <div className={cn("flex-1", view === 'list' && "flex flex-row items-center justify-between gap-4")}>
                      <div>
                        <h3 className="text-[15px] font-bold text-text-main line-clamp-2 mb-2 group-hover:text-primary transition-colors">{doc.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                           <Badge variant="neutral" className="h-5 px-1.5 border-none bg-muted-surface text-[10px] font-bold tracking-tight">{doc.status}</Badge>
                           <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{doc.size}</span>
                        </div>
                      </div>
                      
                      {view === 'grid' && (
                        <div className="flex items-center gap-2 pt-4 border-t border-border">
                           <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                              <ExternalLink size={12} />
                              {doc.linkedEntityType}: {doc.linkedEntityId || 'Internal'}
                           </div>
                        </div>
                      )}
                   </div>
                 </div>
                 
                 <div className={cn(
                   "p-4 border-t border-border bg-muted-surface/[0.02] flex items-center justify-between rounded-b-xl",
                   view === 'list' && "p-0 border-t-0 bg-transparent flex gap-2"
                 )}>
                   <div className="flex items-center gap-2">
                      <Avatar fallback={doc.ownerName?.[0] || 'U'} className="w-6 h-6" />
                      {view === 'grid' && <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Updated Recently</span>}
                   </div>
                   <div className={cn("flex gap-1", view === 'grid' ? "opacity-0 group-hover:opacity-100 transition-opacity" : "")}>
                      {view === 'list' && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary" onClick={(e) => { e.stopPropagation(); handleEdit(doc); }}>
                            <Edit2 size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id!); }}>
                            <Trash2 size={14} />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-text-muted hover:text-primary">
                         <Download size={14} />
                      </Button>
                   </div>
                 </div>

                 {i === 0 && view === 'grid' && (
                   <div className="absolute -top-2 -right-2 z-10">
                      <Badge variant="primary" className="shadow-lg border-2 border-surface h-7 px-2 font-bold flex gap-1.5 bg-ai-accent text-white">
                        <Sparkles size={12} className="fill-white" />
                        AI Verified
                      </Badge>
                   </div>
                 )}
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-text-muted border border-dashed border-border rounded-xl">
             No documents found. Start building your asset library.
          </div>
        )}
        
        {/* Upload Placeholder */}
        <motion.div
           whileHover={{ scale: 0.99 }}
           className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 bg-muted-surface/[0.02] hover:bg-primary-light/[0.05] hover:border-primary/30 transition-all group cursor-pointer"
           onClick={openAddModal}
        >
           <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-4 group-hover:border-primary group-hover:text-primary transition-all">
             <Plus size={24} />
           </div>
           <p className="font-bold text-sm text-text-main">Global Upload</p>
           <p className="text-xs text-text-muted mt-1">Add new assets to CRM</p>
        </motion.div>
      </div>

      <section className="mt-12">
         <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 px-2">Recently Modified</h2>
         <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {documents.slice(0, 4).map(doc => (
               <div key={doc.id} className="min-w-[280px] p-3 rounded-xl border border-border bg-surface hover:border-primary/40 transition-all flex items-center gap-3 cursor-pointer group" onClick={() => handleEdit(doc)}>
                  <div className="w-10 h-10 rounded-lg bg-primary-light/20 text-primary flex items-center justify-center shrink-0">
                    <FileIcon type={doc.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-text-main truncate group-hover:text-primary">{doc.name}</p>
                     <p className="text-[10px] text-text-muted mt-0.5">{doc.linkedEntityType} • {doc.status}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      <DocumentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        document={selectedDocument} 
      />
    </div>
  );
}
