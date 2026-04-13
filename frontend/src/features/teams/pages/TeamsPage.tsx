/**
 * Teams Page
 * 
 * Shows list of teams with create functionality.
 */

import { useState } from 'react';
import { useTeams, useCreateTeam } from '@hooks/useTeamQueries';
import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import './TeamsPage.css';

export function TeamsPage(): JSX.Element {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamVisibility] = useState<'public' | 'private'>('public');
  
  const { data: teams, isLoading } = useTeams({ limit: 100 });
  const createTeamMutation = useCreateTeam();

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      return;
    }
    createTeamMutation.mutate(
      { name: newTeamName, description: newTeamDesc || undefined, visibility: newTeamVisibility },
      {
        onSuccess: () => {
          setNewTeamName('');
          setNewTeamDesc('');
          setShowCreateModal(false);
        },
      }
    );
  };

  return (
    <div className="tf-teams">
      <div className="tf-teams__header">
        <h1 className="tf-teams__title">Teams</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          + New Team
        </Button>
      </div>

      {isLoading ? (
        <p style={{ padding: '40px', textAlign: 'center', color: '#9196a0' }}>Loading teams...</p>
      ) : (
        <div className="tf-teams__grid">
          {teams?.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#9196a0' }}>No teams yet. Create your first team!</p>
          ) : (
            teams?.map((team) => (
              <div key={team.id} className="tf-teams__card">
                <div className="tf-teams__card-header">
                  <Avatar name={team.name} size="lg" />
                  <div className="tf-teams__card-info">
                    <h3 className="tf-teams__card-name">{team.name}</h3>
                    <p className="tf-teams__card-desc">{team.description}</p>
                  </div>
                  <Badge variant={team.visibility === 'public' ? 'success' : 'default'} dot>
                    {team.visibility}
                  </Badge>
                </div>
                <div className="tf-teams__card-footer">
                  <a href={`/projects?team_id=${team.id}`} className="tf-teams__card-link">
                    View Projects →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Team">
        <div className="tf-teams__form">
          <Input
            label="Team Name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="e.g., Engineering"
            autoFocus
          />
          <Input
            label="Description"
            value={newTeamDesc}
            onChange={(e) => setNewTeamDesc(e.target.value)}
            placeholder="What is this team about?"
          />
          <div className="tf-teams__form-actions">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateTeam} isLoading={createTeamMutation.isPending}>
              Create Team
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
