import logger from './logger';

export const sendInvitationEmail = (email: string) => {
  // Logic to send an invitation email (e.g., using SendGrid or Mailgun)
  logger.info(`Invitation email sent to ${email}`);
};