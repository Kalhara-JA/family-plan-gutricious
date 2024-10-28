import { Request, Response } from 'express';
import familyService from '../services/family.service';
import { sendInvitationEmail } from '../utils/emailUtils';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';

export const createFamily = async (req: Request, res: Response) => {
  try {
    const { managerEmail, planId } = req.body;
    logger.info(`Received request to create family for manager: ${managerEmail} with plan: ${planId}`);
    const family = await familyService.createFamily(managerEmail, planId);
    logger.info(`Family created successfully for manager: ${managerEmail}`);
    res.status(201).json(family);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.error(`Failed to create family for manager ${req.body.managerEmail}: Manager already exists.`);
      res.status(409).json({ message: 'Family with this manager already exists' });
    } else {
      logger.error(`Failed to create family for manager ${req.body.managerEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const addFamilyMember = async (req: Request, res: Response) => {
  try {
    const { managerEmail, memberEmail } = req.body;
    logger.info(`Received request to add family member: ${memberEmail} to manager: ${managerEmail}`);
    const familyMember = await familyService.addFamilyMember(managerEmail, memberEmail);
    sendInvitationEmail(memberEmail);
    logger.info(`Family member ${memberEmail} added successfully to manager: ${managerEmail}`);
    res.status(201).json(familyMember);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.error(`Failed to add family member ${req.body.memberEmail} to manager ${req.body.managerEmail}: Member already exists.`);
      res.status(409).json({ message: 'Family member already exists' });
    } else if (error.message === 'Member limit exceeded') {
      logger.error(`Failed to add family member ${req.body.memberEmail} to manager ${req.body.managerEmail}: Member limit exceeded.`);
      res.status(400).json({ message: 'Member limit exceeded for this plan' });
    } else {
      logger.error(`Failed to add family member ${req.body.memberEmail} to manager ${req.body.managerEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const getFamilyDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { managerEmail } = req.params;
    logger.info(`Received request to get family details for manager: ${managerEmail}`);
    const familyDetails = await familyService.getFamilyDetails(managerEmail);
    if (!familyDetails) {
      logger.warn(`No family details found for manager: ${managerEmail}`);
      res.status(404).json({ message: 'Family not found' });
      return;
    }
    logger.info(`Retrieved family details for manager: ${managerEmail}`);
    res.status(200).json(familyDetails);
  } catch (error) {
    logger.error(`Failed to get family details for manager ${req.params.managerEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeFamilyMember = async (req: Request, res: Response) => {
  try {
    const { managerEmail, memberEmail } = req.body;
    logger.info(`Received request to remove family member: ${memberEmail} from manager: ${managerEmail}`);
    await familyService.removeFamilyMember(managerEmail, memberEmail);
    logger.info(`Family member ${memberEmail} removed successfully from manager: ${managerEmail}`);
    res.status(200).json({ message: 'Family member removed successfully' });
  } catch (error) {
    logger.error(`Failed to remove family member ${req.body.memberEmail} from manager ${req.body.managerEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};