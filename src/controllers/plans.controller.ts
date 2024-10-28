import { Request, Response } from 'express';
import logger from '../utils/logger';
import { planService } from '../services/plans.service';
import { Prisma } from '@prisma/client';

export const createPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, memberLimit } = req.body;
    logger.info(`Received request to create plan with name: ${name}`);
    const plan = await planService.createPlan({ name, memberLimit });
    logger.info(`Plan created successfully with name: ${name}`);
    res.status(201).json(plan);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.error(`Failed to create plan: Plan with name ${req.body.name} already exists.`);
      res.status(409).json({ message: 'Plan with this name already exists' });
    } else {
      logger.error(`Failed to create plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const getPlanDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId } = req.params;
    logger.info(`Received request to get plan details for plan ID: ${planId}`);
    const planDetails = await planService.getPlanDetails(Number(planId));
    if (!planDetails) {
      logger.warn(`No plan details found for plan ID: ${planId}`);
      res.status(404).json({ message: 'Plan not found' });
      return;
    }
    logger.info(`Retrieved plan details for plan ID: ${planId}`);
    res.status(200).json(planDetails);
  } catch (error) {
    logger.error(`Failed to get plan details for plan ID ${req.params.planId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId } = req.params;
    const { name, memberLimit } = req.body;
    logger.info(`Received request to update plan with ID: ${planId}`);
    const updatedPlan = await planService.updatePlan(Number(planId), { name, memberLimit });
    if (!updatedPlan) {
      logger.warn(`No plan found for ID: ${planId}`);
      res.status(404).json({ message: 'Plan not found' });
      return;
    }
    logger.info(`Updated plan with ID: ${planId}`);
    res.status(200).json(updatedPlan);
  } catch (error) {
    logger.error(`Failed to update plan with ID ${req.params.planId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId } = req.params;
    logger.info(`Received request to delete plan with ID: ${planId}`);
    await planService.deletePlan(Number(planId));
    logger.info(`Deleted plan with ID: ${planId}`);
    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    logger.error(`Failed to delete plan with ID ${req.params.planId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};