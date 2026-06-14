import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { WelcomeEmail } from "@/emails/welcome-email"
import { NotificationEmail } from "@/emails/notification-email"
import { T2ReminderEmail } from "@/emails/t-2-reminder"
import { T1ReminderEmail } from "@/emails/t-1-reminder"
import { GoodLuckEmail } from "@/emails/good-luck-email"
import { FeedbackRequestEmail } from "@/emails/feedback-request-email"
import { StaleApplicationReminderEmail } from "@/emails/stale-application-reminder"

// Create a Nodemailer transporter using SMTP
// To use Gmail, you must generate an "App Password" in your Google Account settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

export class EmailService {
  /**
   * Internal generic method with exponential backoff retry logic.
   */
  private static async sendWithRetry(payload: { to: string, subject: string, html: string }, maxRetries = 3) {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.warn("SMTP_EMAIL or SMTP_PASSWORD not set. Skipping email.")
      return { success: false, error: "SMTP Credentials missing" }
    }

    const mailOptions = {
      from: `"PlaceTrack" <${process.env.SMTP_EMAIL}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const info = await transporter.sendMail(mailOptions)
        return { success: true, data: info }
      } catch (error) {
        console.error(`Email send attempt ${attempt} failed:`, error)
        if (attempt === maxRetries) {
          return { success: false, error }
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
    return { success: false, error: "Max retries reached" }
  }

  static async sendWelcomeEmail(to: string, name: string) {
    // Render the React component to an HTML string
    const html = await render(WelcomeEmail({ name }))
    return this.sendWithRetry({
      to,
      subject: "Welcome to PlaceTrack!",
      html,
    })
  }

  static async sendNotificationEmail(to: string, subject: string, message: string) {
    const html = await render(NotificationEmail({ subject, message }))
    return this.sendWithRetry({
      to,
      subject,
      html,
    })
  }

  // --- REMINDER EMAILS ---

  static async sendT2Reminder(to: string, props: any) {
    const html = await render(T2ReminderEmail(props))
    return this.sendWithRetry({
      to,
      subject: `Reminder: Your ${props.companyName} ${props.eventType} is in 2 days!`,
      html,
    })
  }

  static async sendT1Reminder(to: string, props: any) {
    const html = await render(T1ReminderEmail(props))
    return this.sendWithRetry({
      to,
      subject: `Action Required: Final Checklist for your ${props.companyName} ${props.eventType} tomorrow`,
      html,
    })
  }

  static async sendGoodLuckEmail(to: string, props: any) {
    const html = await render(GoodLuckEmail(props))
    return this.sendWithRetry({
      to,
      subject: `Good Luck Today at ${props.companyName}! 🚀`,
      html,
    })
  }

  static async sendFeedbackRequestEmail(to: string, props: any) {
    const html = await render(FeedbackRequestEmail(props))
    return this.sendWithRetry({
      to,
      subject: `How did your ${props.companyName} ${props.eventType} go?`,
      html,
    })
  }

  static async sendStaleApplicationReminder(to: string, props: any) {
    const html = await render(StaleApplicationReminderEmail(props))
    return this.sendWithRetry({
      to,
      subject: `Any updates on your application at ${props.companyName}?`,
      html,
    })
  }
}
