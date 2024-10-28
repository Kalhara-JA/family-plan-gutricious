import { Router } from 'express';
import { createFamily, addFamilyMember, getFamilyDetails, removeFamilyMember } from '../controllers/family.controller';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * /family/create:
 *   post:
 *     summary: Create a new family
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               managerEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Family created successfully
 *       409:
 *         description: Family with this manager already exists
 *       500:
 *         description: Failed to create family
 */
router.post('/create', authenticateUser, (req, res) => createFamily(req, res));

/**
 * @swagger
 * /family/add-member:
 *   post:
 *     summary: Add a family member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               managerEmail:
 *                 type: string
 *               memberEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Family member added successfully
 *       409:
 *         description: Family member already exists
 *       500:
 *         description: Failed to add family member
 */
router.post('/add-member', authenticateUser, (req, res) => addFamilyMember(req, res));

/**
 * @swagger
 * /family/{managerEmail}:
 *   get:
 *     summary: Get family details
 *     parameters:
 *       - in: path
 *         name: managerEmail
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Family details retrieved successfully
 *       404:
 *         description: Family not found
 *       500:
 *         description: Failed to get family details
 */
router.get('/:managerEmail', authenticateUser, (req, res) => getFamilyDetails(req, res));

/**
 * @swagger
 * /family/remove-member:
 *   post:
 *     summary: Remove a family member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               managerEmail:
 *                 type: string
 *               memberEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Family member removed successfully
 *       500:
 *         description: Failed to remove family member
 */
router.post('/remove-member', authenticateUser, (req, res) => removeFamilyMember(req, res));

export default router;
