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

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "You're on the Rewine waitlist 🚀",
        text: "Thanks for joining our waitlist! We're thrilled to have you on board. We'll be in touch soon with more updates.\n\nBest,\nThe Team",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
            <h1 style="font-family: Georgia, serif; font-style: italic; font-weight: normal; font-size: 28px; margin-bottom: 40px;">
              Rewine
            </h1>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hi,</p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Thank you for joining the Rewine waitlist.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Once the product is ready, you'll receive free access to Rewine and be invited to participate in beta testing. Excited to help you ace your next interview.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
              Thanks again for joining. If you're interested in collaborating or have any questions, feel free to reply directly to this email.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 8px;">
              Cheers,
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; font-weight: bold; margin-top: 0;">
              Pranshu
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
