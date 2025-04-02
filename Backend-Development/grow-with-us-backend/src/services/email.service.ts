import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const emailService = {
  async sendNotification(to: string, subject: string, content: string) {
    try {
      await sgMail.send({
        to,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject,
        html: content,
      });
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  },

  async sendWelcomeEmail(to: string, name: string) {
    const subject = 'Welcome to GrowWithUs!';
    const content = `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining GrowWithUs. We're excited to have you on board!</p>
    `;
    return this.sendNotification(to, subject, content);
  },

  async sendMessageNotification(to: string, senderName: string) {
    const subject = 'New Message Received';
    const content = `
      <h2>New Message</h2>
      <p>You have received a new message from ${senderName}.</p>
    `;
    return this.sendNotification(to, subject, content);
  },
};