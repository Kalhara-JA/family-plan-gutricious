import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

const createFamily = async (managerEmail: string, planId: number) => {
  try {
    logger.info(`Creating family for manager: ${managerEmail} with plan: ${planId}`);
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      throw new Error('Plan not found');
    }

    const family = await prisma.family.create({
      data: {
        manager: managerEmail,
        planId: plan.id,
        members: {
          create: [{ email: managerEmail, isManager: true }],
        },
      },
    });
    logger.info(`Family created for manager: ${managerEmail}`);
    return family;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.error(`Error creating family for manager ${managerEmail}: Family with this manager already exists.`);
      throw new Error('Family with this manager already exists');
    }
    logger.error(`Error creating family for manager ${managerEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Could not create family');
  }
};

const addFamilyMember = async (managerEmail: string, memberEmail: string) => {
  try {
    logger.info(`Adding family member: ${memberEmail} to manager: ${managerEmail}`);
    const family = await prisma.family.findUnique({
      where: { manager: managerEmail },
      include: { members: true, plan: true },
    });
    if (!family) {
      logger.warn(`Family not found for manager: ${managerEmail}`);
      throw new Error('Family not found');
    }

    if (family.members.length >= family.plan.memberLimit) {
      logger.warn(`Member limit exceeded for family managed by: ${managerEmail}`);
      throw new Error('Member limit exceeded');
    }

    const familyMember = await prisma.familyMember.create({
      data: {
        email: memberEmail,
        familyId: family.id,
      },
    });
    logger.info(`Family member ${memberEmail} added to manager: ${managerEmail}`);
    return familyMember;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.error(`Error adding family member ${memberEmail} to manager ${managerEmail}: Family member already exists.`);
      throw new Error('Family member already exists');
    }
    logger.error(`Error adding family member ${memberEmail} to manager ${managerEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Could not add family member');
  }
};

const getFamilyDetails = async (managerEmail: string) => {
  try {
    logger.info(`Fetching family details for manager: ${managerEmail}`);
    const familyDetails = await prisma.family.findUnique({
      where: { manager: managerEmail },
      include: { members: true, plan: true },
    });
    if (!familyDetails) {
      logger.warn(`No family details found for manager: ${managerEmail}`);
      throw new Error('Family not found');
    }
    return familyDetails;
  } catch (error) {
    logger.error(`Error fetching family details for manager ${managerEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Could not fetch family details');
  }
};

const removeFamilyMember = async (managerEmail: string, memberEmail: string) => {
  try {
    logger.info(`Removing family member: ${memberEmail} from manager: ${managerEmail}`);
    const family = await prisma.family.findUnique({
      where: { manager: managerEmail },
    });
    if (!family) {
      logger.warn(`Family not found for manager: ${managerEmail}`);
      throw new Error('Family not found');
    }

    await prisma.familyMember.delete({
      where: { email: memberEmail },
    });
    logger.info(`Family member ${memberEmail} removed from manager: ${managerEmail}`);
  } catch (error) {
    logger.error(`Error removing family member ${memberEmail} from manager ${managerEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Could not remove family member');
  }
};

export default {
  createFamily,
  addFamilyMember,
  getFamilyDetails,
  removeFamilyMember,
};