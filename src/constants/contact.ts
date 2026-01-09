/**
 * Contact information constants
 *
 * Centralized location for all contact details used across the portfolio.
 * Update these values to customize the portfolio for different users.
 */
export const CONTACT = {
  name: 'Nick Smith',
  title: 'Senior Frontend Engineer',
  email: 'nick@example.com',
  github: 'https://github.com/nicksmith',
  linkedin: 'https://linkedin.com/in/nicksmith',
  website: 'https://nicksmith.software',
} as const;

/** Email mailto link */
export const MAILTO = `mailto:${CONTACT.email}`;
