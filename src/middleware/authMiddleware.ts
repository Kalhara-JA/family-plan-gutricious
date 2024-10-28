import { NextApiRequest } from 'next';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the session token from cookies
    const sessionToken =
      req.cookies['next-auth.session-token'] ||
      req.cookies['__Secure-next-auth.session-token'];

    if (!sessionToken) {
      logger.warn('Unauthorized access attempt, session token missing');
      res.status(401).json({ error: 'Unauthorized' });
      return; // Ensure the function returns void
    }

    // Verify the session token with the NextAuth API endpoint
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/session`;
    const response = await axios.get(verifyUrl, {
      headers: {
        Cookie: `next-auth.session-token=${sessionToken}`,
      },
    });

    console.log('response', response.data);

    if (response.status !== 200 || !response.data) {
      logger.warn('Unauthorized access attempt, invalid session token');
      res.status(401).json({ error: 'Unauthorized' });
      return; // Ensure the function returns void
    }

    // Attach session data to the request object
    (req as any).session = response.data;
    next(); // Proceed to the next middleware
  } catch (error) {
    logger.error(
      `Error while authenticating user: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    res.status(500).json({ error: 'Failed to authenticate user' });
    return; // Ensure the function returns void
  }
};
