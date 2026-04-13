/**
 * Projects Page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects, useCreateProject } from '@hooks/useProjectQueries';
import { useTeams } from '@hooks/useTeamQueries';
import { Badge } from '@components/ui/Badge';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import './ProjectsPage.css';

export function ProjectsPage(): JSX.Element {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  
  const { data: projects, isLoading } = useProjects({ limit: 100 });
  const { data: teams } = useTeams({ limit: 100 });
  const createProjectMutation = useCreateProject();

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !selectedTeamId) {
      return;
    }
    createProjectMutation.mutate(
      { 
        name: newProjectName, 
        description: newProjectDesc || undefined, 
        team_id: selectedTeamId,
        color: '#7170ff',
      },
      {
        onSuccess: () => {
          setNewProjectName('');
          setNewProjectDesc('');
          setSelectedTeamId('');
          setShowCreateModal(false);
        },
      }
    );
  };

  return (
    <div className="tf-projects">
      <div className="tf-projects__header">
        <div>
          <h1 className="tf-projects__title">Projects</h1>
          <p className="tf-projects__subtitle">{projects?.length || 0} projects</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          + New Project
        </Button>
      </div>

      {isLoading ? (
        <p style={{ padding: '40px', textAlign: 'center', color: '#9196a0' }}>Loading projects...</p>
      ) : (
        <div className="tf-projects__list">
          {projects?.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#9196a0' }}>No projects yet. Create your first project!</p>
          ) : (
            projects?.map((project) => {
              const team = teams?.find((t) => t.id === project.team_id);
              return (
                <Link key={project.id} to={`/projects/${project.id}`} className="tf-projects__card">
                  <div className="tf-projects__card-accent" style={{ background: project.color }} />
                  <div className="tf-projects__card-content">
                    <div className="tf-projects__card-header">
                      <h3 className="tf-projects__card-name">{project.name}</h3>
                      <Badge variant={project.status === 'active' ? 'primary' : project.status === 'completed' ? 'success' : 'default'}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="tf-projects__card-desc">{project.description}</p>
                    <div className="tf-projects__card-meta">
                      <span>{team?.name || 'Unknown Team'}</span>
                      {project.due_date && (
                        <>
                          <span>•</span>
                          <span>Due {new Date(project.due_date).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Project">
        <div className="tf-projects__form">
          <Input
            label="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="e.g., Website Redesign"
            autoFocus
          />
          <Input
            label="Description"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
            placeholder="What is this project about?"
          />
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 510, color: '#9196a0' }}>
              Team
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
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
              <option value="">Select a team</option>
              {teams?.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div className="tf-projects__form-actions">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateProject} isLoading={createProjectMutation.isPending}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
