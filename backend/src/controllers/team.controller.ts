/**
 * Team Controller
 * Handles all team-related operations
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wsService } from '../websocket/websocket.service';
import { AuthenticatedRequest } from '../middleware/auth';

export const getTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
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
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const orderBy: any = {};
    orderBy[sort as string] = order;

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
      }),
      prisma.team.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        data: teams,
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

export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const team = await prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TEAM_NOT_FOUND',
          message: 'Team not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      visibility = 'public',
    } = req.body;

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

    const team = await prisma.team.create({
      data: {
        name,
        description,
        visibility,
        owner_id: req.userId!,
      },
    });

    wsService.broadcastTeamUpdate('create', team);

    res.status(201).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { name, description, visibility } = req.body;

    const existingTeam = await prisma.team.findUnique({ where: { id } });
    if (!existingTeam) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TEAM_NOT_FOUND',
          message: 'Team not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const team = await prisma.team.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(visibility !== undefined && { visibility }),
      },
    });

    wsService.broadcastTeamUpdate('update', team);

    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const existingTeam = await prisma.team.findUnique({ where: { id } });
    if (!existingTeam) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TEAM_NOT_FOUND',
          message: 'Team not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    await prisma.team.delete({ where: { id } });

    wsService.broadcastTeamUpdate('delete', { id });

    res.json({
      success: true,
      data: null,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
