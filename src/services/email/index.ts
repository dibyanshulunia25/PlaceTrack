import { resend } from "@/lib/resend"
import { WelcomeEmail } from "@/emails/welcome-email"
import { NotificationEmail } from "@/emails/notification-email"
import { T2ReminderEmail } from "@/emails/t-2-reminder"
import { T1ReminderEmail } from "@/emails/t-1-reminder"
import { GoodLuckEmail } from "@/emails/good-luck-email"
import { FeedbackRequestEmail } from "@/emails/feedback-request-email"

const FROM_EMAIL = "PlaceTrack <noreply@placetrack.app>" // Replace with verified domain

export class EmailService {
  /**
   * Internal generic method with exponential backoff retry logic.
   */
  private static async sendWithRetry(payload: any, maxRetries = 3) {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set. Skipping email.")
      return { success: false, error: "API Key missing" }
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await resend.emails.send(payload)
        if (error) throw error
        return { success: true, data }
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
    return this.sendWithRetry({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to PlaceTrack!",
      react: WelcomeEmail({ name }),
    })
  }

  static async sendNotificationEmail(to: string, subject: string, message: string) {
    return this.sendWithRetry({
      from: FROM_EMAIL,
      to,
      subject,
      react: NotificationEmail({ subject, message }),
    })
  }

  // --- REMINDER EMAILS ---

  static async sendT2Reminder(to: string, props: any) {
    return this.sendWithRetry({
      from: FROM_EMAIL,
      to,
      subject: `Reminder: Your ${props.companyName} ${props.eventType} is in 2 days!`,
      react: T2ReminderEmail(props),
    })
  }

  static async sendT1Reminder(to: string, props: any) {
    return this.sendWithRetry({
      from: FROM_EMAIL,
      to,
      subject: `Action Required: Final Checklist for your ${props.companyName} ${props.eventType} tomorrow`,
      react: T1ReminderEmail(props),
    })
  }

  static async sendGoodLuckEmail(to: string, props: any) {
    return this.sendWithRetry({
      from: FROM_EMAIL,
      to,
      subject: `Good Luck Today at ${props.companyName}! 🚀`,
      react: GoodLuckEmail(props),
    })
  }

  static async sendFeedbackRequestEmail(to: string, props: any) {
    return this.sendWithRetry({
      from: FROM_EMAIL,
      to,
      subject: `How did your ${props.companyName} ${props.eventType} go?`,
      react: FeedbackRequestEmail(props),
    })
  }
}
