import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bikramdevsaw9@gmail.com';

/**
 * Configure Nodemailer Transport
 * Automatically detects Gmail / custom SMTP settings from .env
 */
function createTransporter() {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (user && pass) {
    // If Gmail service is preferred (default)
    if (!process.env.SMTP_HOST || process.env.EMAIL_SERVICE === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });
    }

    // Custom SMTP server configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user,
        pass,
      },
    });
  }

  return null;
}

/**
 * Send Contact Notification Email to Admin (bikramdevsaw9@gmail.com)
 * @param {Object} data - Contact form submission details
 */
export async function sendContactNotificationEmail({
  name,
  email,
  phone,
  subject,
  message,
  farmerName,
  farmerId,
}) {
  const targetEmail = process.env.ADMIN_EMAIL || 'bikramdevsaw9@gmail.com';
  const cleanSubject = subject || 'New Agricultural Inquiry from AgriConnect';
  const formattedTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Agricultural Inquiry - AgriConnect</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f2; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    
    <!-- Top Header Banner -->
    <div style="background: linear-gradient(135deg, #064e3b 0%, #047857 100%); padding: 32px 28px; text-align: left; color: #ffffff;">
      <div style="display: inline-block; background: rgba(255,255,255,0.18); padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.25);">
        🌾 AgriConnect Advisory Dispatch
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
        New Contact Message Received
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0; font-weight: 500;">
        Incoming customer / buyer transmission routed to your administration desk.
      </p>
    </div>

    <!-- Main Content Details -->
    <div style="padding: 28px;">
      
      <!-- Meta Information Card -->
      <div style="background: #f8faf9; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">Sender Name:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 800;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email Address:</td>
            <td style="padding: 6px 0;">
              <a href="mailto:${email}" style="color: #059669; font-weight: 700; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${phone || 'Not Provided'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Inquiry Category:</td>
            <td style="padding: 6px 0; color: #047857; font-weight: 700;">${cleanSubject}</td>
          </tr>
          ${farmerName ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Target Farmer:</td>
            <td style="padding: 6px 0; color: #047857; font-weight: 700;">${farmerName} ${farmerId ? `(#${farmerId})` : ''}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Timestamp:</td>
            <td style="padding: 6px 0; color: #475569;">${formattedTime} (IST)</td>
          </tr>
        </table>
      </div>

      <!-- Message Content Block -->
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #334155; margin: 0 0 10px 0;">
          Detailed Message Content:
        </h3>
        <div style="background: #ffffff; border-left: 4px solid #10b981; border: 1px solid #e2e8f0; border-left-width: 4px; padding: 18px 20px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">
${message}
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 24px 0 12px 0;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(cleanSubject)}" 
           style="background: #059669; color: #ffffff; padding: 13px 30px; font-size: 13px; font-weight: 800; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);">
          ✉️ Direct Reply to ${name}
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #f8faf9; padding: 18px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
      Routed automatically to <strong>${targetEmail}</strong> by AgriConnect Platform Services.<br>
      Recipient: Bikram Dev Saw (Root Administrator).
    </div>

  </div>
</body>
</html>
  `;

  const textContent = `
🌾 [NEW AGRICONNECT INQUIRY RECEIVED]
=========================================
Sender Name:    ${name}
Sender Email:   ${email}
Phone Number:   ${phone || 'Not Provided'}
Inquiry Topic:  ${cleanSubject}
${farmerName ? `Target Farmer:  ${farmerName}\n` : ''}Timestamp:      ${formattedTime} (IST)
Recipient:      ${targetEmail}
=========================================

MESSAGE CONTENT:
${message}

-----------------------------------------
Reply directly by emailing: ${email}
  `.trim();

  const transporter = createTransporter();

  if (transporter) {
    try {
      const fromAddress = process.env.EMAIL_FROM || `"${name} via AgriConnect" <${process.env.EMAIL_USER || 'no-reply@agriconnect.org'}>`;

      const info = await transporter.sendMail({
        from: fromAddress,
        to: targetEmail,
        replyTo: email,
        subject: `🌾 AgriConnect: ${cleanSubject} - From ${name}`,
        text: textContent,
        html: htmlContent,
      });

      console.log(`✅ [EMAIL DISPATCHED] Message from ${name} (${email}) delivered to ${targetEmail}. Message ID: ${info.messageId}`);
      return { success: true, delivered: true, messageId: info.messageId };
    } catch (err) {
      console.error(`❌ [EMAIL ERROR] Failed to send email via SMTP:`, err.message);
      // Fallback logging below so inquiry is never lost
    }
  }

  // Fallback console logging when EMAIL_PASS is not configured or SMTP fails
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📬 [MOCK/CONSOLE DISPATCH] Contact message for ${targetEmail}:`);
  console.log(textContent);
  if (!process.env.EMAIL_PASS) {
    console.log('ℹ️ NOTICE: Add EMAIL_USER and EMAIL_PASS to your .env to receive direct emails via Gmail SMTP.');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return { success: true, delivered: false, note: 'Logged to server console (SMTP credentials pending)' };
}

/**
 * Send Farmer Registration Alert to Admin (bikramdevsaw9@gmail.com)
 * Notifies the root administrator that a new grower needs KYC verification
 */
export async function sendFarmerRegistrationNotification({
  name,
  email,
  phone,
  farmName,
  location,
  specialties,
}) {
  const targetEmail = process.env.ADMIN_EMAIL || 'bikramdevsaw9@gmail.com';
  const clientBase = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
  const adminPortalUrl = `${clientBase}/dashboard/admin`;
  const formattedTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const cropsList = Array.isArray(specialties) ? specialties.join(', ') : 'Organic Produce';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Farmer Registration Pending Verification - AgriConnect</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f2; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    
    <div style="background: linear-gradient(135deg, #064e3b 0%, #047857 100%); padding: 32px 28px; text-align: left; color: #ffffff;">
      <div style="display: inline-block; background: rgba(251, 191, 36, 0.25); color: #fde68a; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border: 1px solid rgba(251, 191, 36, 0.4);">
        ⏳ KYC Verification Required
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
        New Farmer Registered on AgriConnect
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0; font-weight: 500;">
        A new agricultural producer has joined the platform and awaits your administrative approval.
      </p>
    </div>

    <div style="padding: 28px;">
      <div style="background: #f8faf9; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">Farmer Name:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 800;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Farm / Estate:</td>
            <td style="padding: 6px 0; color: #047857; font-weight: 800;">${farmName || `${name}'s Organic Farm`}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email Address:</td>
            <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #059669; font-weight: 700; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${phone || 'Not Provided'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Location / District:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${location || 'India'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Crops / Specialties:</td>
            <td style="padding: 6px 0; color: #047857; font-weight: 700;">${cropsList}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Registration Time:</td>
            <td style="padding: 6px 0; color: #475569;">${formattedTime} (IST)</td>
          </tr>
        </table>
      </div>

      <div style="background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 8px; font-size: 13px; color: #92400e; margin-bottom: 24px;">
        <strong>Action Needed:</strong> Log into the <a href="${adminPortalUrl}" style="color: #b45309; font-weight: 800;">Admin Dashboard</a> under <strong>Farmers Directory</strong> to review and verify this producer.
      </div>
    </div>

    <div style="background: #f8faf9; padding: 18px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
      Dispatched automatically to <strong>${targetEmail}</strong> by AgriConnect Directorate.
    </div>

  </div>
</body>
</html>
  `;

  const textContent = `
🌾 [NEW FARMER REGISTRATION - PENDING ADMIN VERIFICATION]
=========================================
Farmer Name:      ${name}
Farm Name:        ${farmName || `${name}'s Organic Farm`}
Email:            ${email}
Phone:            ${phone || 'Not Provided'}
Location:         ${location || 'India'}
Specialties:      ${cropsList}
Status:           PENDING ADMIN VERIFICATION ⏳
Registered:       ${formattedTime} (IST)
Admin Desk:       ${targetEmail}
=========================================
Please log into the Admin Console (${adminPortalUrl}) to approve this grower.
  `.trim();

  const transporter = createTransporter();

  if (transporter) {
    try {
      const fromAddress = process.env.EMAIL_FROM || `"AgriConnect Directorate" <${process.env.EMAIL_USER || 'no-reply@agriconnect.org'}>`;
      const info = await transporter.sendMail({
        from: fromAddress,
        to: targetEmail,
        replyTo: email,
        subject: `🌾 [Action Required] New Farmer Awaiting Verification: ${name} (${farmName || 'Farm'})`,
        text: textContent,
        html: htmlContent,
      });

      console.log(`✅ [EMAIL DISPATCHED] Farmer registration alert for ${name} delivered to ${targetEmail}. Message ID: ${info.messageId}`);
      return { success: true, delivered: true, messageId: info.messageId };
    } catch (err) {
      console.error(`❌ [EMAIL ERROR] Failed to send farmer alert via SMTP:`, err.message);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📬 [MOCK/CONSOLE DISPATCH] Farmer Registration Alert for ${targetEmail}:`);
  console.log(textContent);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return { success: true, delivered: false, note: 'Logged to server console' };
}

export default {
  sendContactNotificationEmail,
  sendFarmerRegistrationNotification,
};

