import axios from 'axios'
import { db } from '../db/database.js'
import { v4 as uuidv4 } from 'uuid'

interface NotificationPayload {
  userId: string
  type: string
  title: string
  message: string
  resourceType?: string
  resourceId?: string
  channels?: string[]
}

export class NotificationService {
  async sendNotification(payload: NotificationPayload): Promise<void> {
    const { userId, type, title, message, resourceType, resourceId, channels = ['in_app'] } = payload

    // Store in-app notification
    const notificationId = uuidv4()
    await db.run(
      `INSERT INTO notifications (id, user_id, type, title, message, resource_type, resource_id, channel)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [notificationId, userId, type, title, message, resourceType, resourceId, 'in_app']
    )

    // Send via other channels
    if (channels.includes('email')) {
      await this.sendEmail(userId, title, message)
    }

    if (channels.includes('teams')) {
      await this.sendTeams(title, message)
    }

    if (channels.includes('sms')) {
      await this.sendSMS(userId, message)
    }
  }

  private async sendEmail(userId: string, title: string, message: string): Promise<void> {
    try {
      const user = await db.get<any>('SELECT email FROM users WHERE id = ?', [userId])
      if (!user) return

      if (!process.env.SENDGRID_API_KEY) {
        console.warn('SendGrid API key not configured')
        return
      }

      await axios.post('https://api.sendgrid.com/v3/mail/send', {
        personalizations: [{ to: [{ email: user.email }] }],
        from: { email: 'notifications@hospital.local', name: 'TapTask' },
        subject: title,
        content: [
          {
            type: 'text/html',
            value: `
              <h2>${title}</h2>
              <p>${message}</p>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                TapTask Notification System
              </p>
            `,
          },
        ],
      })
    } catch (error) {
      console.error('Failed to send email:', error)
    }
  }

  private async sendTeams(title: string, message: string): Promise<void> {
    try {
      if (!process.env.TEAMS_WEBHOOK_URL) {
        console.warn('Teams webhook not configured')
        return
      }

      await axios.post(process.env.TEAMS_WEBHOOK_URL, {
        @type: 'MessageCard',
        @context: 'https://schema.org/extensions',
        summary: title,
        themeColor: '0078D4',
        sections: [
          {
            activityTitle: title,
            activitySubtitle: 'TapTask Notification',
            text: message,
          },
        ],
      })
    } catch (error) {
      console.error('Failed to send Teams notification:', error)
    }
  }

  private async sendSMS(userId: string, message: string): Promise<void> {
    try {
      // TODO: Implement SMS via Twilio or similar
      console.log(`SMS to user ${userId}: ${message}`)
    } catch (error) {
      console.error('Failed to send SMS:', error)
    }
  }

  async getNotifications(userId: string, limit = 50, offset = 0): Promise<any[]> {
    return db.all<any>(
      `SELECT * FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    )
  }

  async markAsRead(notificationId: string): Promise<void> {
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [notificationId])
  }

  async checkEscalationRules(): Promise<void> {
    // Check for requests waiting > 30 minutes
    const overdue = await db.all<any>(
      `SELECT r.*, u.id as user_id
       FROM requests r
       JOIN bins b ON r.bin_id = b.id
       JOIN users u ON b.department_id = u.department_id
       WHERE r.status IN ('pending', 'assigned')
       AND datetime(r.requested_at, '+30 minutes') < CURRENT_TIMESTAMP
       AND r.updated_at < datetime('now', '-1 minute')`
    )

    for (const request of overdue) {
      await this.sendNotification({
        userId: request.user_id,
        type: 'escalation',
        title: `⚠️ Overdue Request - ${request.bin_code}`,
        message: `Request has been waiting ${Math.round(
          (Date.now() - new Date(request.requested_at).getTime()) / 60000
        )} minutes`,
        resourceType: 'request',
        resourceId: request.id,
        channels: ['teams', 'in_app'],
      })
    }

    // Check for critical stock levels
    const critical = await db.all<any>(
      `SELECT b.*, i.name, u.id as user_id
       FROM bins b
       JOIN items i ON b.item_id = i.id
       JOIN users u ON b.department_id = u.department_id
       WHERE b.current_quantity < (b.par_level * 0.2)
       AND u.role IN ('supervisor', 'admin')`
    )

    for (const bin of critical) {
      await this.sendNotification({
        userId: bin.user_id,
        type: 'critical_stock',
        title: `🔴 Critical Stock Alert - ${bin.name}`,
        message: `${bin.name} is critically low: ${bin.current_quantity}/${bin.par_level} units`,
        resourceType: 'bin',
        resourceId: bin.id,
        channels: ['teams', 'email'],
      })
    }
  }
}

export const notificationService = new NotificationService()
