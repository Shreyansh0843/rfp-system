const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  /**
   * Send RFP invitation email to vendor
   */
  async sendRFPInvitation(vendor, rfp, customMessage = '') {
    try {
      const deadlineFormatted = new Date(rfp.deadline).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const budgetRange = rfp.budget?.max 
        ? `$${rfp.budget.min?.toLocaleString()} - $${rfp.budget.max?.toLocaleString()}`
        : 'To be discussed';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .rfp-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
            .detail-label { font-weight: bold; color: #64748b; }
            .detail-value { color: #1e293b; }
            .cta-button { display: inline-block; background: #0d9488; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
            .requirements { margin-top: 20px; }
            .requirement-item { background: #f1f5f9; padding: 10px; margin: 5px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Request for Proposal</h1>
              <p>You've been invited to submit a proposal</p>
            </div>
            <div class="content">
              <p>Dear ${vendor.name},</p>
              
              ${customMessage ? `<p>${customMessage}</p>` : ''}
              
              <p>We are pleased to invite <strong>${vendor.company}</strong> to submit a proposal for the following opportunity:</p>
              
              <div class="rfp-details">
                <h2 style="color: #0d9488; margin-top: 0;">${rfp.title}</h2>
                <p>${rfp.description}</p>
                
                <div class="detail-row">
                  <span class="detail-label">Category:</span>
                  <span class="detail-value">${rfp.category}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Budget Range:</span>
                  <span class="detail-value">${budgetRange}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Submission Deadline:</span>
                  <span class="detail-value">${deadlineFormatted}</span>
                </div>
              </div>
              
              ${rfp.requirements?.length > 0 ? `
                <div class="requirements">
                  <h3>Key Requirements:</h3>
                  ${rfp.requirements.slice(0, 5).map(req => `
                    <div class="requirement-item">
                      <strong>${req.title}</strong>
                      <span style="color: #0d9488; margin-left: 10px;">(${req.priority})</span>
                      ${req.description ? `<p style="margin: 5px 0 0 0; color: #64748b;">${req.description}</p>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              
              <p style="margin-top: 30px;">Please review the requirements carefully and submit your proposal before the deadline.</p>
              
              <center>
                <a href="${process.env.FRONTEND_URL}/proposal/submit/${rfp._id}" class="cta-button">
                  View Full RFP & Submit Proposal
                </a>
              </center>
            </div>
            <div class="footer">
              <p>This email was sent via RFP Management System</p>
              <p>If you have any questions, please reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await this.transporter.sendMail({
        from: `"RFP Management System" <${process.env.SMTP_FROM}>`,
        to: vendor.email,
        subject: `RFP Invitation: ${rfp.title}`,
        html: htmlContent
      });

      logger.info(`RFP invitation sent to ${vendor.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error(`Email sending error: ${error.message}`);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send proposal submission confirmation
   */
  async sendProposalConfirmation(vendor, rfp, proposal) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Proposal Submitted</h1>
              <p>Your proposal has been received successfully</p>
            </div>
            <div class="content">
              <p>Dear ${vendor.name},</p>
              
              <p>Thank you for submitting your proposal for <strong>${rfp.title}</strong>.</p>
              
              <p><strong>Proposal Details:</strong></p>
              <ul>
                <li>Proposal Title: ${proposal.title}</li>
                <li>Submitted: ${new Date(proposal.submittedAt).toLocaleString()}</li>
                <li>Proposed Amount: $${proposal.pricing?.totalAmount?.toLocaleString()}</li>
              </ul>
              
              <p>We will review all submissions and get back to you soon.</p>
            </div>
            <div class="footer">
              <p>RFP Management System</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await this.transporter.sendMail({
        from: `"RFP Management System" <${process.env.SMTP_FROM}>`,
        to: vendor.email,
        subject: `Proposal Received: ${rfp.title}`,
        html: htmlContent
      });

      logger.info(`Confirmation sent to ${vendor.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error(`Confirmation email error: ${error.message}`);
      throw new Error(`Failed to send confirmation: ${error.message}`);
    }
  }

  /**
   * Send RFP deadline reminder
   */
  async sendDeadlineReminder(vendor, rfp, daysRemaining) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .urgent { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Deadline Reminder</h1>
              <p>${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining</p>
            </div>
            <div class="content">
              <p>Dear ${vendor.name},</p>
              
              <div class="urgent">
                <strong>Reminder:</strong> The deadline for submitting your proposal for 
                <strong>${rfp.title}</strong> is approaching.
              </div>
              
              <p>Deadline: ${new Date(rfp.deadline).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              
              <p>Please ensure your proposal is submitted before the deadline.</p>
            </div>
            <div class="footer">
              <p>RFP Management System</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await this.transporter.sendMail({
        from: `"RFP Management System" <${process.env.SMTP_FROM}>`,
        to: vendor.email,
        subject: `[Reminder] ${daysRemaining} Days Left: ${rfp.title}`,
        html: htmlContent
      });

      logger.info(`Reminder sent to ${vendor.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error(`Reminder email error: ${error.message}`);
      throw new Error(`Failed to send reminder: ${error.message}`);
    }
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('SMTP connection verified');
      return true;
    } catch (error) {
      logger.error(`SMTP verification failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = new EmailService();
