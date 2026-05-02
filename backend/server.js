import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'password',
  },
});

app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Attempt to extract a first name from the email handle
  const extractFirstName = (emailStr) => {
    try {
      const handle = emailStr.split('@')[0];
      // Split by common delimiters and take the first part
      let firstPart = handle.split(/[._+-]/)[0];
      // Remove trailing digits
      firstPart = firstPart.replace(/[0-9]+$/, '');
      // If it looks like a valid name (more than 1 char), capitalize it
      if (firstPart.length > 1) {
        return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
      }
      return '';
    } catch (e) {
      return '';
    }
  };

  const firstName = extractFirstName(email);
  const greetingText = firstName ? `Hey ${firstName},` : 'Hey,';

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "You're on the Rewine waitlist 🚀",
        text: `${greetingText}\n\nWelcome to Rewine. Glad you're here.\n\nWe're building the world's first in-meeting intelligence layer. The moment a company name comes up in your call, Rewine surfaces real-time data: last funding round, key people, recent news, pulled live from across the internet. No more tab-switching, no more flying blind.\n\nFounders walk in confident. VCs walk in prepared.\n\nWe'll reach out the moment you're off the waitlist. In the meantime, reply to this email if you have questions. We read every one.\n\nTalk soon,\nThe Rewine Team`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
            <h1 style="font-family: Georgia, serif; font-style: italic; font-weight: normal; font-size: 28px; margin-bottom: 40px;">
              Rewine
            </h1>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${greetingText}</p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Welcome to Rewine. Glad you're here.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              We're building the world's first in-meeting intelligence layer. The moment a company name comes up in your call, Rewine surfaces real-time data: last funding round, key people, recent news, pulled live from across the internet. No more tab-switching, no more flying blind.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Founders walk in confident. VCs walk in prepared.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
              We'll reach out the moment you're off the waitlist. In the meantime, reply to this email if you have questions. We read every one.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 8px;">
              Talk soon,
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; font-weight: bold; margin-top: 0;">
              The Rewine Team
            </p>
          </div>
        `
      });
      console.log(`Email sent successfully to ${email}`);
    } else {
      console.log(`[Mock] Waitlist signup for ${email}. Email not sent (Missing credentials in .env).`);
    }

    res.status(200).json({ success: true, message: 'Added to waitlist' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    // Even if email fails (like bad credentials), we still want the frontend to show success
    // because it successfully saved to Google Forms via the frontend backup.
    res.status(200).json({ success: true, message: 'Added to waitlist, but email sending failed' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
