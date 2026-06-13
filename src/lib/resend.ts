import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

// Create a singleton to avoid multiple instances in development
const globalForResend = global as unknown as { resend: Resend };

export const resend =
  globalForResend.resend ||
  new Resend(apiKey || 're_dummy_key_for_build');

if (process.env.NODE_ENV !== 'production') globalForResend.resend = resend;
