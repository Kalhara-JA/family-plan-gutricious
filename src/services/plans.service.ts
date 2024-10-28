import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

const createPlan = async (planData: { name: string; memberLimit: number }) => {
  try {
    logger.info(`Creating plan with name: ${planData.name}`);
    const plan = await prisma.plan.create({
      data: planData,
    });
    logger.info(`Plan created successfully with name: ${planData.name}`);
    return plan;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.error(`Plan with name ${planData.name} already exists.`);
      throw new Error('Plan with this name already exists');
    }
    logger.error(`Error creating plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Could not create plan');
  }
};

const getPlanDetails = async (planId: number) => {
  try {
    logger.info(`Fetching plan details for ID: ${planId}`);
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });
    return plan;
  } catch (error) {
    logger.error(`Error fetching plan details for ID ${planId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Could not fetch plan details');
  }
};

const updatePlan = async (planId: number, planData: { name: string; memberLimit: number }) => {
  try {
    logger.info(`Updating plan with ID: ${planId}`);
    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: planData,
    });
    return updatedPlan;
  } catch (error) {
    logger.error(`Error updating plan with ID ${planId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Could not update plan');
  }
};

const deletePlan = async (planId: number) => {
  try {
    logger.info(`Deleting plan with ID: ${planId}`);
    await prisma.plan.delete({
      where: { id: planId },
    });
    logger.info(`Plan with ID ${planId} deleted successfully`);
  } catch (error) {
    logger.error(`Error deleting plan with ID ${planId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Could not delete plan');
  }
};

export const planService = {
  createPlan,
  getPlanDetails,
  updatePlan,
  deletePlan,
};