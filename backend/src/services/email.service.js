const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Create SMTP transporter using environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // your email address
        pass: process.env.SMTP_PASS, // your Gmail App Password (not regular password)
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      },
      // Force IPv4 to avoid IPv6 connectivity issues
      family: 4,
      // Add timeout settings
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 15000,   // 15 seconds
      socketTimeout: 30000      // 30 seconds
    });
  }

  // Email templates for different status updates
  getEmailTemplates(status, applicantData) {
    const { first_name, last_name } = applicantData;
    const fullName = `${first_name} ${last_name}`;

    const templates = {
      shortlisted: {
        subject: 'Congratulations! Your Application Has Been Shortlisted - AFRICOM Careers',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #0F2A5D; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">AFRICOM HR</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Recruitment Team</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #0F2A5D; margin-top: 0;">Congratulations, ${fullName}!</h2>
              
              <p style="color: #333; line-height: 1.6;">
                We are pleased to inform you that your profile has been <strong>shortlisted</strong> for the next phase of our recruitment process.
              </p>
              
              <p style="color: #333; line-height: 1.6;">
                Your qualifications and experience have impressed our team, and we would like to move forward with your application.
              </p>
              
              <div style="background: white; padding: 20px; border-left: 4px solid #05CD99; margin: 20px 0;">
                <h3 style="color: #0F2A5D; margin-top: 0;">Next Steps:</h3>
                <ul style="color: #333; line-height: 1.6;">
                  <li>Our recruitment team will review your application in detail</li>
                  <li>You may be contacted for an interview scheduling</li>
                  <li>Please keep your contact information updated</li>
                </ul>
              </div>
              
              <p style="color: #333; line-height: 1.6;">
                If you have any questions, please don't hesitate to contact our HR department.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">
                  Best regards,<br>
                  <strong>AFRICOM Recruitment Team</strong>
                </p>
              </div>
            </div>
          </div>
        `
      },
      under_review: {
        subject: 'Interview Invitation - AFRICOM Careers',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #0F2A5D; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">AFRICOM HR</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Recruitment Team</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #0F2A5D; margin-top: 0;">Interview Invitation, ${fullName}!</h2>
              
              <p style="color: #333; line-height: 1.6;">
                We would like to invite you for an <strong>interview</strong> as part of our recruitment process.
              </p>
              
              <p style="color: #333; line-height: 1.6;">
                Your application has successfully passed the initial screening, and we would like to learn more about your qualifications and experience.
              </p>
              
              <div style="background: white; padding: 20px; border-left: 4px solid #9333EA; margin: 20px 0;">
                <h3 style="color: #0F2A5D; margin-top: 0;">Interview Details:</h3>
                <ul style="color: #333; line-height: 1.6;">
                  <li>Our HR team will contact you shortly to schedule the interview</li>
                  <li>Please prepare to discuss your experience and qualifications</li>
                  <li>The interview may be conducted virtually or in-person</li>
                  <li>You will receive confirmation with specific date and time</li>
                </ul>
              </div>
              
              <p style="color: #333; line-height: 1.6;">
                Please ensure you are available for the interview and respond promptly to scheduling requests.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">
                  We look forward to speaking with you!<br>
                  <strong>AFRICOM Recruitment Team</strong>
                </p>
              </div>
            </div>
          </div>
        `
      },
      rejected: {
        subject: 'Update on Your Application - AFRICOM Careers',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #0F2A5D; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">AFRICOM HR</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Recruitment Team</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #0F2A5D; margin-top: 0;">Update on Your Application, ${fullName}</h2>
              
              <p style="color: #333; line-height: 1.6;">
                Thank you for your interest in joining AFRICOM and for taking the time to submit your application.
              </p>
              
              <p style="color: #333; line-height: 1.6;">
                After careful consideration of your qualifications and experience, we have decided to move forward with other candidates whose profile more closely matches our current requirements.
              </p>
              
              <div style="background: white; padding: 20px; border-left: 4px solid #EE5D50; margin: 20px 0;">
                <h3 style="color: #0F2A5D; margin-top: 0;">What This Means:</h3>
                <ul style="color: #333; line-height: 1.6;">
                  <li>Your application was carefully reviewed by our team</li>
                  <li>The competition was strong for this position</li>
                  <li>We encourage you to apply for future openings</li>
                </ul>
              </div>
              
              <p style="color: #333; line-height: 1.6;">
                We appreciate your interest in AFRICOM and wish you the best in your job search. We will keep your resume on file for future opportunities that may align with your profile.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">
                  Thank you again for your interest in AFRICOM.<br>
                  <strong>AFRICOM Recruitment Team</strong>
                </p>
              </div>
            </div>
          </div>
        `
      }
    };

    return templates[status] || null;
  }

  async sendStatusUpdateEmail(applicantEmail, status, applicantData) {
    try {
      const template = this.getEmailTemplates(status, applicantData);
      
      if (!template) {
        console.warn(`No email template found for status: ${status}`);
        return { success: false, message: 'No email template for this status' };
      }

      const mailOptions = {
        from: `"AFRICOM HR" <${process.env.SMTP_USER}>`,
        to: applicantEmail,
        subject: template.subject,
        html: template.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log(`Email sent successfully to ${applicantEmail}:`, info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        message: `Status update email sent to ${applicantEmail}`
      };

    } catch (error) {
      console.error('Failed to send status update email:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send status update email'
      };
    }
  }

  // Test email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('SMTP server connection verified successfully');
      return { success: true, message: 'SMTP connection verified' };
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
