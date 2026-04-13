/**
 * Tasks Page
 */

import { useState } from 'react';
import { useTasks, useCreateTask } from '@hooks/useTaskQueries';
import { useProjects } from '@hooks/useProjectQueries';
import { TaskCard } from '../components/TaskCard';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Input } from '@components/ui/Input';
import './TasksPage.css';

type FilterStatus = 'all' | 'todo' | 'in_progress' | 'review' | 'done';

export function TasksPage(): JSX.Element {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const { data: tasks, isLoading } = useTasks({ limit: 200 });
  const { data: projects } = useProjects({ limit: 100 });
  const createTaskMutation = useCreateTask();

  const filteredTasks = (tasks || []).filter((task) => {
    const matchesStatus = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !selectedProjectId) {
      return;
    }
    createTaskMutation.mutate(
      {
        title: newTaskTitle,
        description: newTaskDesc || undefined,
        project_id: selectedProjectId,
        priority: 'medium',
      },
      {
        onSuccess: () => {
          setNewTaskTitle('');
          setNewTaskDesc('');
          setSelectedProjectId('');
          setShowCreateModal(false);
        },
      }
    );
  };

  return (
    <div className="tf-tasks">
      <div className="tf-tasks__header">
        <h1 className="tf-tasks__title">My Tasks</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>+ New Task</Button>
      </div>

      <div className="tf-tasks__filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="tf-tasks__search"
        />
        <div className="tf-tasks__status-filters">
          {(['all', 'todo', 'in_progress', 'review', 'done'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              className={`tf-tasks__filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="tf-tasks__list">
        {isLoading ? (
          <div className="tf-tasks__empty">
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="tf-tasks__empty">
            <span style={{ fontSize: '48px' }}>📋</span>
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Task">
        <div className="tf-tasks__form">
          <Input
            label="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g., Design homepage mockup"
            autoFocus
          />
          <Input
            label="Description"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            placeholder="What needs to be done?"
          />
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 510, color: '#9196a0' }}>
              Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#2c2d2e',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: '#f7f8f8',
                fontSize: '14px',
              }}
            >
              <option value="">Select a project</option>
              {projects?.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="tf-tasks__form-actions">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateTask} isLoading={createTaskMutation.isPending}>
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
