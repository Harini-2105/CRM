import * as React from 'react';
import { Card, Button, Badge, Avatar, Input } from '../components/UI';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle,
  MoreVertical,
  AlertCircle,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  User,
  Trash2,
  Edit2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { taskService, Task } from '../services/taskService';
import { TaskModal } from '../components/TaskModal';

export default function Tasks() {
  const { profile } = useAuth();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState('list');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    if (!profile?.orgId) return;

    const unsubscribe = taskService.subscribeToTasks(profile.uid, profile.orgId, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.uid, profile?.orgId]);

  const handleToggleStatus = async (task: Task) => {
    if (!task.id) return;
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await taskService.updateTask(task.id, { status: newStatus });
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await taskService.deleteTask(id);
    }
  };

  const openAddModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Tasks</h1>
          <p className="text-text-muted">Manage your daily CRM execution and relationship motions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-1 bg-border/20 rounded-lg flex items-center mr-2">
            <Button 
              variant={view === 'list' ? 'primary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-md"
              onClick={() => setView('list')}
            >
              <List size={16} />
            </Button>
            <Button 
              variant={view === 'board' ? 'primary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-md"
              onClick={() => setView('board')}
            >
              <LayoutGrid size={16} />
            </Button>
          </div>
          <Button variant="primary" size="sm" className="gap-2 font-bold px-4" onClick={openAddModal}>
            <Plus size={16} /> Create Task
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-border">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10 border-none bg-transparent focus:ring-0 shadow-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" className="gap-2 text-text-muted font-bold">
          <Filter size={16} /> Filter By
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Active Tasks ({pendingTasks.length})</h3>
            <Button variant="ghost" size="sm" className="text-primary text-[11px] font-bold">Mark All Complete</Button>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="p-12 text-center text-text-muted">Loading tasks...</div>
            ) : pendingTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={cn(
                  "p-4 hover:border-primary/40 transition-all cursor-pointer group flex items-start gap-4",
                )}>
                  <button 
                    className="mt-1 text-text-muted hover:text-primary transition-colors group"
                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(task); }}
                  >
                    <Circle size={20} className="group-hover:hidden" />
                    <CheckCircle2 size={20} className="hidden group-hover:block" />
                  </button>
                  <div className="flex-1 min-w-0" onClick={() => handleEdit(task)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-text-main group-hover:text-primary transition-colors truncate">{task.title}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                         <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted-surface text-text-muted">
                           {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                         </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted capitalize">
                        <User size={12} />
                        {task.linkedEntityType}: {task.linkedEntityId || 'None'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted" onClick={() => handleEdit(task)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-danger" onClick={() => handleDelete(task.id!)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
            {!loading && pendingTasks.length === 0 && (
              <div className="p-12 text-center bg-muted-surface/30 rounded-xl border border-dashed border-border text-text-muted italic">
                No pending tasks. Great job!
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-2 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Completed Recently</h3>
          </div>
          <div className="space-y-3 opacity-60">
            {completedTasks.map((task) => (
              <Card key={task.id} className="p-4 bg-muted-surface border-none flex items-start gap-4 cursor-pointer" onClick={() => handleEdit(task)}>
                <CheckCircle2 
                  size={20} 
                  className="text-success mt-1 cursor-pointer" 
                  onClick={(e) => { e.stopPropagation(); handleToggleStatus(task); }}
                />
                <div className="flex-1 min-w-0 line-through text-text-muted">
                  <h4 className="font-medium text-sm truncate">{task.title}</h4>
                  <p className="text-[10px] mt-1">Completed {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-danger" 
                  onClick={(e) => { e.stopPropagation(); handleDelete(task.id!); }}
                >
                  <Trash2 size={14} />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
             <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-wider">Productivity Pulse</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <p className="text-sm text-text-muted font-medium">Completion Rate</p>
                   <p className="text-sm font-bold">{tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%</p>
                </div>
                <div className="w-full h-1.5 bg-muted-surface rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }} />
                </div>
                <div className="flex items-center justify-between pt-2">
                   <div className="text-center flex-1">
                      <p className="text-xl font-bold text-text-main">{completedTasks.length}</p>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Done</p>
                   </div>
                   <div className="w-px h-8 bg-border" />
                   <div className="text-center flex-1">
                      <p className="text-xl font-bold text-text-main">{pendingTasks.length}</p>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Pending</p>
                   </div>
                </div>
             </div>
          </Card>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
      />
    </div>
  );
}
