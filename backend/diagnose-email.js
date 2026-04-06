const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file manually
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        process.env[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes
      }
    });
  }
}

async function diagnoseEmailIssues() {
  console.log('=== Email Configuration Diagnosis ===\n');
  
  // Load environment variables
  loadEnvFile();
  
  // Check environment variables
  console.log('1. Environment Variables:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || 587);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***CONFIGURED***' : 'NOT SET');
  console.log('SMTP_SECURE:', process.env.SMTP_SECURE || 'false');
  
  // Test basic connectivity to Gmail SMTP
  console.log('\n2. Testing Gmail SMTP connectivity...');
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      family: 4, // Force IPv4
      debug: true, // Enable debug output
      logger: true // Enable logging
    });
    
    console.log('Attempting to verify connection...');
    const verified = await transporter.verify();
    console.log('Connection verified:', verified);
    
    // Test sending a simple email
    console.log('\n3. Testing email send...');
    const testResult = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to self for testing
      subject: 'Test Email - AFRICOM HR System',
      text: 'This is a test email from the AFRICOM HR system.',
      html: '<p>This is a <strong>test email</strong> from the AFRICOM HR system.</p>'
    });
    
    console.log('Test email sent successfully!');
    console.log('Message ID:', testResult.messageId);
    
  } catch (error) {
    console.error('\n=== ERROR DETAILS ===');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    // Provide specific troubleshooting advice
    console.log('\n=== TROUBLESHOOTING ADVICE ===');
    
    if (error.code === 'ETIMEDOUT') {
      console.log('• Connection timed out. Possible causes:');
      console.log('  - Firewall blocking port 587');
      console.log('  - Network connectivity issues');
      console.log('  - ISP blocking SMTP traffic');
      console.log('• Try: Check firewall settings, try different network');
    }
    
    if (error.code === 'EAUTH') {
      console.log('• Authentication failed. Possible causes:');
      console.log('  - Incorrect Gmail password');
      console.log('  - Need to use App Password instead of regular password');
      console.log('  - 2FA not properly configured');
      console.log('• Try: Generate new App Password from Google Account settings');
    }
    
    if (error.code === 'ESOCKET') {
      console.log('• Socket error. Possible causes:');
      console.log('  - Network connectivity issues');
      console.log('  - SMTP server unreachable');
      console.log('• Try: Check internet connection, try different SMTP server');
    }
  }
}

diagnoseEmailIssues().catch(console.error);
