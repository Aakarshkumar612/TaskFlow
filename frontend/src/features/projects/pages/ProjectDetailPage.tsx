/**
 * Project Detail Page
 *
 * Shows project info, tasks list/board view.
 * Fetches real data from the backend API.
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProject, useProjectSections } from '@hooks/useProjectQueries';
import { useTasks } from '@hooks/useTaskQueries';
import { Button } from '@components/ui/Button';
import { TaskCard } from '@features/tasks/components/TaskCard';
import { Skeleton, SkeletonText } from '@components/ui/Skeleton';
import './ProjectDetailPage.css';

type ViewMode = 'list' | 'board';

export function ProjectDetailPage(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Fetch real data from backend
  const { data: project, isLoading: projectLoading } = useProject(projectId!);
  const { data: tasks, isLoading: tasksLoading } = useTasks({ project_id: projectId, limit: 100 });
  const { data: sections } = useProjectSections(projectId!);

  if (projectLoading || tasksLoading) {
    return (
      <div className="tf-project-detail">
        <Skeleton width="300px" height="32px" />
        <SkeletonText lines={2} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="tf-project-detail__not-found">
        <h2>Project not found</h2>
        <a href="/projects">← Back to projects</a>
      </div>
    );
  }

  // Group tasks by section for board view
  const getTasksBySection = (sectionId: string) => {
    return tasks?.filter((t) => t.section_id === sectionId) || [];
  };

  return (
    <div className="tf-project-detail">
      <div className="tf-project-detail__header">
        <div className="tf-project-detail__title-section">
          <div className="tf-project-detail__color-dot" style={{ background: project.color || '#7170ff' }} />
          <div>
            <h1 className="tf-project-detail__title">{project.name}</h1>
            <p className="tf-project-detail__desc">{project.description}</p>
          </div>
        </div>
        <div className="tf-project-detail__actions">
          <div className="tf-project-detail__view-toggle">
            <button
              className={`tf-project-detail__view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
            <button
              className={`tf-project-detail__view-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
            >
              Board
            </button>
          </div>
          <Button variant="primary">+ Add Task</Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="tf-project-detail__list">
          {(!tasks || tasks.length === 0) ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#9196a0' }}>
              No tasks in this project yet. Create your first task!
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      ) : (
        <div className="tf-project-detail__board">
          {(!sections || sections.length === 0) ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#9196a0' }}>
              No sections available in this project.
            </p>
          ) : (
            sections.map((section) => {
              const sectionTasks = getTasksBySection(section.id);
              return (
                <div key={section.id} className="tf-project-detail__board-column">
                  <div className="tf-project-detail__board-header">
                    <h3 className="tf-project-detail__board-title">{section.name}</h3>
                    <span className="tf-project-detail__board-count">{sectionTasks.length}</span>
                  </div>
                  <div className="tf-project-detail__board-tasks">
                    {sectionTasks.length === 0 ? (
                      <p style={{ padding: '16px', textAlign: 'center', color: '#9196a0', fontSize: '13px' }}>
                        No tasks
                      </p>
                    ) : (
                      sectionTasks.map((task) => (
                        <TaskCard key={task.id} task={task} compact />
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
