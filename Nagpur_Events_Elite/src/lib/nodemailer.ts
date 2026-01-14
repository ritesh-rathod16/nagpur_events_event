import nodemailer from "nodemailer";

// Using explicit configuration for better reliability with Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  // Adding timeout settings
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  // Detailed logging
  logger: true,
  debug: true
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Nodemailer Transporter Error:", error);
    console.log("Check if GMAIL_USER and GMAIL_APP_PASSWORD are correct in .env");
  } else {
    console.log("✅ Nodemailer Transporter is ready to send emails");
  }
});

export const sendOTPEmail = async (email: string, otp: string) => {
  console.log(`📧 Attempting to send OTP email to: ${email}`);
  
  const mailOptions = {
    from: `"NagpurEvents Elite" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your email - NagpurEvents Elite",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">NagpurEvents Elite</h1>
        </div>
        <div style="background-color: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1a365d; margin-top: 0;">Email Verification</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">Thank you for registering. Please use the following code to verify your email address:</p>
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; border: 1px solid #fcd34d;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #1a365d;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #718096;">This code will expire in 5 minutes. If you didn't request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
          © ${new Date().getFullYear()} NagpurEvents Elite. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! Message ID:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Error sending email via Nodemailer:", error);
    
    // Provide more specific hints based on error
    if (error.code === 'EAUTH') {
      console.log("HINT: Authentication failed. Please verify your Gmail App Password.");
    } else if (error.code === 'ESOCKET') {
      console.log("HINT: Connection timeout or network issue. Check your internet or firewall.");
    }
    
    return { success: false, error: error.message || error };
  }
};

export const sendBookingConfirmation = async (data: {
  email: string;
  userName: string;
  eventName: string;
  ticketPdf: Buffer;
  invoicePdf: Buffer;
  ticketId: string;
}) => {
  const mailOptions = {
    from: `"NagpurEvents Elite" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `Booking Confirmed: ${data.eventName} - NagpurEvents Elite`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">NagpurEvents Elite</h1>
        </div>
        <div style="background-color: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1a365d; margin-top: 0;">Booking Confirmed!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">Hi ${data.userName},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">Your booking for <strong>${data.eventName}</strong> has been successfully confirmed. We've attached your ticket and invoice to this email.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Ticket ID:</p>
            <p style="margin: 5px 0 0 0; color: #1a365d; font-size: 18px; font-weight: bold;">${data.ticketId}</p>
          </div>

          <p style="font-size: 14px; color: #718096;">Please present the QR code on your ticket at the venue for entry verification.</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
          © ${new Date().getFullYear()} NagpurEvents Elite. All rights reserved.
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `Ticket-${data.ticketId}.pdf`,
        content: data.ticketPdf,
      },
      {
        filename: `Invoice-${data.ticketId}.pdf`,
        content: data.invoicePdf,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Error sending booking confirmation email:", error);
    return { success: false, error: error.message || error };
  }
};

export default transporter;
