/**
 * Database Seeder
 * Populates the database with initial sample data for development.
 * 
 * NOTE: User IDs are placeholders for Clerk integration.
 * When Clerk is integrated, replace these with actual Clerk user IDs.
 */

import prisma from '../config/database';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.section.deleteMany();
  await prisma.project.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create sample users (IDs are placeholders for Clerk integration)
  const user = await prisma.user.create({
    data: {
      id: 'user-clerk-placeholder',
      name: 'TaskFlow User',
      email: 'user@taskflow.dev',
      timezone: 'UTC',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: 'user-clerk-sample-002',
      name: 'John Doe',
      email: 'john@taskflow.dev',
      timezone: 'UTC',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: 'user-clerk-sample-003',
      name: 'Jane Smith',
      email: 'jane@taskflow.dev',
      timezone: 'UTC',
    },
  });

  console.log('✅ Created users');

  // Create teams
  const team1 = await prisma.team.create({
    data: {
      id: 'team-001',
      name: 'Engineering',
      description: 'Core engineering team working on product development',
      owner_id: user.id,
      visibility: 'public',
    },
  });

  const team2 = await prisma.team.create({
    data: {
      id: 'team-002',
      name: 'Design',
      description: 'UI/UX design and product design team',
      owner_id: user.id,
      visibility: 'public',
    },
  });

  const team3 = await prisma.team.create({
    data: {
      id: 'team-003',
      name: 'Marketing',
      description: 'Growth marketing and content team',
      owner_id: user.id,
      visibility: 'private',
    },
  });

  console.log('✅ Created teams');

  // Create projects
  const proj1 = await prisma.project.create({
    data: {
      id: 'proj-001',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website',
      team_id: team1.id,
      owner_id: user.id,
      status: 'active',
      color: '#7170ff',
      start_date: '2026-03-01',
      due_date: '2026-06-30',
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      id: 'proj-002',
      name: 'Mobile App v2',
      description: 'Next generation mobile application',
      team_id: team1.id,
      owner_id: user.id,
      status: 'active',
      color: '#27a644',
      start_date: '2026-04-01',
      due_date: '2026-09-30',
    },
  });

  const proj3 = await prisma.project.create({
    data: {
      id: 'proj-003',
      name: 'API Development',
      description: 'RESTful API for third-party integrations',
      team_id: team1.id,
      owner_id: user.id,
      status: 'active',
      color: '#3b82f6',
      start_date: '2026-02-15',
      due_date: '2026-05-15',
    },
  });

  const proj4 = await prisma.project.create({
    data: {
      id: 'proj-004',
      name: 'Brand Guidelines',
      description: 'Updated brand identity and design system',
      team_id: team2.id,
      owner_id: user.id,
      status: 'completed',
      color: '#f59e0b',
      start_date: '2026-01-01',
      due_date: '2026-03-31',
    },
  });

  console.log('✅ Created projects');

  // Create sections for proj1
  const sec1 = await prisma.section.create({
    data: { id: 'sec-001', name: 'To Do', project_id: proj1.id, position: 0 },
  });
  const sec2 = await prisma.section.create({
    data: { id: 'sec-002', name: 'In Progress', project_id: proj1.id, position: 1 },
  });
  const sec3 = await prisma.section.create({
    data: { id: 'sec-003', name: 'Review', project_id: proj1.id, position: 2 },
  });
  const sec4 = await prisma.section.create({
    data: { id: 'sec-004', name: 'Done', project_id: proj1.id, position: 3 },
  });

  console.log('✅ Created sections');

  // Create tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        id: 'task-001',
        title: 'Design homepage mockup',
        description: 'Create high-fidelity mockup for the new homepage including hero section, features, and CTA',
        project_id: proj1.id,
        section_id: sec2.id,
        assignee_id: user.id,
        creator_id: user.id,
        status: 'in_progress',
        priority: 'high',
        start_date: '2026-04-01',
        due_date: '2026-04-12',
        estimated_hours: 8,
        position: 0,
        tags: JSON.stringify(['design', 'frontend']),
      },
    }),
    prisma.task.create({
      data: {
        id: 'task-002',
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        project_id: proj1.id,
        section_id: sec1.id,
        assignee_id: user.id,
        creator_id: user.id,
        status: 'todo',
        priority: 'urgent',
        start_date: '2026-04-10',
        due_date: '2026-04-15',
        estimated_hours: 4,
        position: 1,
        tags: JSON.stringify(['devops', 'infrastructure']),
      },
    }),
    prisma.task.create({
      data: {
        id: 'task-003',
        title: 'Write API documentation',
        description: 'Document all REST API endpoints with examples and response schemas',
        project_id: proj3.id,
        section_id: sec3.id,
        assignee_id: user2.id,
        creator_id: user.id,
        status: 'review',
        priority: 'medium',
        start_date: '2026-04-01',
        due_date: '2026-04-12',
        estimated_hours: 6,
        position: 2,
        tags: JSON.stringify(['documentation', 'api']),
      },
    }),
    prisma.task.create({
      data: {
        id: 'task-004',
        title: 'Fix login bug',
        description: 'Users are unable to login with social auth providers',
        project_id: proj1.id,
        section_id: sec4.id,
        assignee_id: user3.id,
        creator_id: user.id,
        status: 'done',
        priority: 'high',
        start_date: '2026-04-05',
        due_date: '2026-04-08',
        estimated_hours: 3,
        position: 3,
        tags: JSON.stringify(['bug', 'auth']),
      },
    }),
    prisma.task.create({
      data: {
        id: 'task-005',
        title: 'Create user onboarding flow',
        description: 'Design and implement guided onboarding for new users',
        project_id: proj2.id,
        section_id: sec2.id,
        assignee_id: user.id,
        creator_id: user.id,
        status: 'in_progress',
        priority: 'medium',
        start_date: '2026-04-10',
        due_date: '2026-04-15',
        estimated_hours: 12,
        position: 4,
        tags: JSON.stringify(['ux', 'onboarding']),
      },
    }),
    prisma.task.create({
      data: {
        id: 'task-006',
        title: 'Implement dark mode',
        description: 'Add dark mode support across all components',
        project_id: proj1.id,
        section_id: sec1.id,
        assignee_id: user2.id,
        creator_id: user.id,
        status: 'todo',
        priority: 'low',
        start_date: '2026-04-15',
        due_date: '2026-04-25',
        estimated_hours: 8,
        position: 5,
        tags: JSON.stringify(['frontend', 'ui']),
      },
    }),
  ]);

  console.log('✅ Created tasks');

  // Create comments
  const comment1 = await prisma.comment.create({
    data: {
      id: 'comment-001',
      content: 'Looking great! Can we adjust the color scheme to match the brand guidelines?',
      task_id: tasks[0].id,
      user_id: user2.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      id: 'comment-002',
      content: 'Sure, I will update it by tomorrow.',
      task_id: tasks[0].id,
      user_id: user.id,
      parent_comment_id: comment1.id,
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      id: 'comment-003',
      content: 'This is a critical bug affecting production users.',
      task_id: tasks[3].id,
      user_id: user3.id,
    },
  });

  console.log('✅ Created comments');

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        id: 'notif-001',
        user_id: user.id,
        type: 'task_assigned',
        message: 'You were assigned to "Create user onboarding flow"',
        metadata: JSON.stringify({ task_id: 'task-005' }),
        is_read: false,
        related_entity_id: 'task-005',
        related_entity_type: 'task',
      },
    }),
    prisma.notification.create({
      data: {
        id: 'notif-002',
        user_id: user.id,
        type: 'comment',
        message: 'John Doe commented on "Design homepage mockup"',
        metadata: JSON.stringify({ task_id: 'task-001', comment_id: 'comment-001' }),
        is_read: false,
        related_entity_id: 'task-001',
        related_entity_type: 'task',
      },
    }),
    prisma.notification.create({
      data: {
        id: 'notif-003',
        user_id: user.id,
        type: 'task_due',
        message: '"Write API documentation" is due tomorrow',
        metadata: JSON.stringify({ task_id: 'task-003' }),
        is_read: false,
        related_entity_id: 'task-003',
        related_entity_type: 'task',
      },
    }),
    prisma.notification.create({
      data: {
        id: 'notif-004',
        user_id: user.id,
        type: 'project_invite',
        message: 'You were added to "Mobile App v2" project',
        metadata: JSON.stringify({ project_id: 'proj-002' }),
        is_read: true,
        related_entity_id: 'proj-002',
        related_entity_type: 'project',
      },
    }),
    prisma.notification.create({
      data: {
        id: 'notif-005',
        user_id: user.id,
        type: 'mention',
        message: 'Jane Smith mentioned you in "Fix login bug"',
        metadata: JSON.stringify({ task_id: 'task-004' }),
        is_read: true,
        related_entity_id: 'task-004',
        related_entity_type: 'task',
      },
    }),
  ]);

  console.log('✅ Created notifications');
  console.log('🎉 Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
