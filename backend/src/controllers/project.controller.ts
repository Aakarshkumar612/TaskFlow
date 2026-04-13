/**
 * Project Controller
 * Handles all project-related operations
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wsService } from '../websocket/websocket.service';
import { AuthenticatedRequest } from '../middleware/auth';

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      team_id,
      status,
      search,
      page = '1',
      limit = '50',
      sort = 'created_at',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (team_id) where.team_id = team_id;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const orderBy: any = {};
    orderBy[sort as string] = order;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          team: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        data: projects,
        meta: {
          current_page: pageNum,
          per_page: limitNum,
          total,
          total_pages: totalPages,
          has_next: pageNum < totalPages,
          has_prev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        team: {
          select: { id: true, name: true },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      team_id,
      color = '#7170ff',
      status = 'active',
      start_date,
      due_date,
    } = req.body;

    if (!name || !team_id) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name and team_id are required',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        team_id,
        owner_id: req.userId!,
        color,
        status,
        start_date,
        due_date,
      },
      include: {
        team: {
          select: { id: true, name: true },
        },
      },
    });

    wsService.broadcastProjectUpdate('create', project);

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { name, description, status, color, start_date, due_date } = req.body;

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(color !== undefined && { color }),
        ...(start_date !== undefined && { start_date }),
        ...(due_date !== undefined && { due_date }),
      },
      include: {
        team: {
          select: { id: true, name: true },
        },
      },
    });

    wsService.broadcastProjectUpdate('update', project);

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    await prisma.project.delete({ where: { id } });

    wsService.broadcastProjectUpdate('delete', { id });

    res.json({
      success: true,
      data: null,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId as string;

    const sections = await prisma.section.findMany({
      where: { project_id: projectId },
      orderBy: { position: 'asc' },
    });

    res.json({ success: true, data: sections });
  } catch (error) {
    next(error);
  }
};

export const createSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId as string;
    const { name, position } = req.body;

    if (!name) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name is required',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const maxPosition = await prisma.section.aggregate({
      where: { project_id: projectId },
      _max: { position: true },
    });

    const section = await prisma.section.create({
      data: {
        name,
        project_id: projectId,
        position: position ?? (maxPosition._max.position ?? -1) + 1,
      },
    });

    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

export const updateSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { name, position } = req.body;

    const section = await prisma.section.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(position !== undefined && { position }),
      },
    });

    res.json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

export const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    await prisma.section.delete({ where: { id } });

    res.json({
      success: true,
      data: null,
      message: 'Section deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
