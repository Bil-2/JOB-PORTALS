import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: `"JobZee Portal" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to JobZee Portal!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to JobZee!</h1>
        <p>Hi ${user.name},</p>
        <p>Welcome to JobZee Portal! We're excited to have you join our community.</p>
        <p>As a <strong>${user.role}</strong>, you now have access to:</p>
        ${user.role === 'Job Seeker' ? `
          <ul>
            <li>Browse thousands of job opportunities</li>
            <li>Apply to jobs with one click</li>
            <li>Get personalized job recommendations</li>
            <li>Track your application status</li>
          </ul>
        ` : `
          <ul>
            <li>Post unlimited job listings</li>
            <li>Manage applications efficiently</li>
            <li>Access candidate profiles</li>
            <li>Schedule interviews seamlessly</li>
          </ul>
        `}
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Get Started</a>
        </div>
        <p>Best regards,<br>The JobZee Team</p>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendJobApplicationNotification(employer, application, job) {
    const subject = `New Application for ${job.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Job Application</h1>
        <p>Hi ${employer.name},</p>
        <p>You have received a new application for your job posting:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${job.title}</h3>
          <p><strong>Applicant:</strong> ${application.name}</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Phone:</strong> ${application.phone}</p>
          <p><strong>Applied on:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/applications/me" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">View Application</a>
        </div>
        <p>Best regards,<br>The JobZee Team</p>
      </div>
    `;

    return this.sendEmail(employer.email, subject, html);
  }

  async sendApplicationStatusUpdate(applicant, job, status, feedback = '') {
    const subject = `Application Update: ${job.title}`;
    const statusColors = {
      'accepted': '#28a745',
      'rejected': '#dc3545',
      'interview': '#ffc107',
      'pending': '#6c757d'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Application Status Update</h1>
        <p>Hi ${applicant.name},</p>
        <p>Your application status has been updated:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${job.title}</h3>
          <p><strong>Status:</strong> <span style="color: ${statusColors[status] || '#333'}; font-weight: bold; text-transform: uppercase;">${status}</span></p>
          ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ''}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/applications/me" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">View Details</a>
        </div>
        <p>Best regards,<br>The JobZee Team</p>
      </div>
    `;

    return this.sendEmail(applicant.email, subject, html);
  }

  async sendJobAlert(user, jobs) {
    const subject = `${jobs.length} New Job${jobs.length > 1 ? 's' : ''} Matching Your Preferences`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Job Opportunities</h1>
        <p>Hi ${user.name},</p>
        <p>We found ${jobs.length} new job${jobs.length > 1 ? 's' : ''} that match your preferences:</p>
        ${jobs.map(job => `
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">${job.title}</h3>
            <p><strong>Company:</strong> ${job.company || 'Not specified'}</p>
            <p><strong>Location:</strong> ${job.city}, ${job.country}</p>
            <p><strong>Salary:</strong> ${job.fixedSalary ? `$${job.fixedSalary.toLocaleString()}` : `$${job.salaryFrom?.toLocaleString()} - $${job.salaryTo?.toLocaleString()}`}</p>
            <p>${job.description.substring(0, 150)}...</p>
            <a href="${process.env.FRONTEND_URL}/job/${job._id}" style="color: #007bff; text-decoration: none;">View Details →</a>
          </div>
        `).join('')}
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/job/getall" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Browse All Jobs</a>
        </div>
        <p>Best regards,<br>The JobZee Team</p>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendInterviewScheduled(applicant, employer, job, interviewDetails) {
    const subject = `Interview Scheduled: ${job.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Interview Scheduled</h1>
        <p>Hi ${applicant.name},</p>
        <p>Great news! An interview has been scheduled for your application:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${job.title}</h3>
          <p><strong>Date:</strong> ${new Date(interviewDetails.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${interviewDetails.time}</p>
          <p><strong>Type:</strong> ${interviewDetails.type}</p>
          ${interviewDetails.location ? `<p><strong>Location:</strong> ${interviewDetails.location}</p>` : ''}
          ${interviewDetails.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${interviewDetails.meetingLink}">${interviewDetails.meetingLink}</a></p>` : ''}
          ${interviewDetails.notes ? `<p><strong>Notes:</strong> ${interviewDetails.notes}</p>` : ''}
        </div>
        <p>Please make sure to be available at the scheduled time. Good luck!</p>
        <p>Best regards,<br>The JobZee Team</p>
      </div>
    `;

    return this.sendEmail(applicant.email, subject, html);
  }
}

export default new EmailService();
