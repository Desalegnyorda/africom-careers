# Email Notification Setup Guide

## Overview
The AFRICOM HR dashboard now includes automated email notifications when applicant statuses are updated. When you click "Shortlist," "Interview," or "Reject," the system will automatically send a professional email to the applicant.

## Email Configuration

### 1. Update Environment Variables
Edit your `.env` file in the backend directory with your SMTP credentials:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Gmail Setup (Recommended)
If using Gmail:

1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password in the `SMTP_PASS` field

### 3. Alternative SMTP Providers
You can also use other SMTP providers:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo Mail:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Email Templates

The system includes three professional email templates:

### 1. Shortlisted
- **Subject**: "Congratulations! Your Application Has Been Shortlisted"
- **Content**: Professional congratulatory message with next steps
- **Color Scheme**: Green accents

### 2. Interview
- **Subject**: "Interview Invitation - AFRICOM Careers"
- **Content**: Interview invitation with scheduling information
- **Color Scheme**: Purple accents

### 3. Rejected
- **Subject**: "Update on Your Application - AFRICOM Careers"
- **Content**: Professional rejection message encouraging future applications
- **Color Scheme**: Red accents

## How It Works

1. **Status Update**: Admin clicks a status button in the dashboard
2. **Database Update**: Backend updates the applicant's status
3. **Email Trigger**: System automatically sends the appropriate email template
4. **User Feedback**: Frontend shows "Sending..." state and confirms email delivery

## Frontend Features

- **Loading States**: Buttons show "Sending..." during email transmission
- **Success Messages**: Alerts confirm both status update and email delivery
- **Error Handling**: Graceful fallback if email sending fails
- **Responsive Design**: Maintains professional appearance during all states

## Testing the System

1. **Start Backend**: `npm run dev` (ensure .env is configured)
2. **Start Frontend**: Open your React development server
3. **Test Status Updates**: 
   - Select an applicant
   - Click "Shortlist," "Interview," or "Reject"
   - Verify the email is sent successfully

## Troubleshooting

### Common Issues:

1. **Authentication Failed**:
   - Check SMTP credentials
   - For Gmail, ensure you're using an App Password (not regular password)
   - Verify 2FA is enabled

2. **Connection Timeout**:
   - Check SMTP host and port settings
   - Verify firewall isn't blocking SMTP connections

3. **Email Not Received**:
   - Check spam/junk folders
   - Verify recipient email address
   - Check email logs in backend console

### Debug Mode:
The system logs detailed email information to the console:
```javascript
console.log(`Email notification result for ${applicant.email}:`, emailResult);
```

## Security Notes

- **Never commit** your `.env` file to version control
- **Use App Passwords** instead of regular passwords
- **Consider using** transactional email services (SendGrid, Mailgun) for production
- **Monitor** email deliverability and spam complaints

## Production Recommendations

For production deployment, consider:

1. **Transactional Email Services**: SendGrid, Mailgun, AWS SES
2. **Email Templates**: Dynamic content with applicant-specific details
3. **Queue System**: Background job processing for email sending
4. **Analytics**: Track email open rates and engagement
5. **Unsubscribe Option**: Include unsubscribe links for compliance

## Files Modified

- `backend/src/services/email.service.js` - Email service module
- `backend/src/modules/applicants/status.controller.js` - Updated with email sending
- `backend/.env` - Added SMTP configuration
- `frontend/src/admin/AdminDashboard.tsx` - Added loading states and feedback

The email notification system is now fully integrated and ready for use!
