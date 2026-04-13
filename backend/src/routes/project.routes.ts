/**
 * Project Routes
 */

import { Router } from 'express';
import * as projectController from '../controllers/project.controller';

const router = Router();

// Project routes
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Section routes
router.get('/:projectId/sections', projectController.getProjectSections);
router.post('/:projectId/sections', projectController.createSection);
router.put('/sections/:id', projectController.updateSection);
router.delete('/sections/:id', projectController.deleteSection);

export default router;
