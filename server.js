import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Resend } from 'resend';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, cb) => cb(null, ['image/jpeg','image/png','image/webp'].includes(file.mimetype)) });

function getResend() {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.NOTIFY_TO) return null;
  return new Resend(process.env.RESEND_API_KEY);
}
app.post('/api/notify', async (req, res) => {
  const { event, message } = req.body || {};
  const allowed = new Set(['readiness_yes', 'letter_opened', 'thank_you']);
  if (!allowed.has(event)) return res.status(400).json({ error: 'Unsupported event.' });
  if (event === 'thank_you' && (typeof message !== 'string' || message.length > 1500)) return res.status(400).json({ error: 'Please enter a shorter message.' });
  const resend = getResend();
  if (!resend) return res.status(503).json({ error: 'Email notifications are not configured yet.' });
  try {
    const subject = event === 'readiness_yes' ? 'Shakeeba adventure: readiness button clicked' : event === 'letter_opened' ? 'Shakeeba adventure: birthday letter opened' : 'Shakeeba adventure: thank-you message';
    const body = event === 'thank_you' ? `Optional thank-you message:\n\n${message}` : `Website event: ${event}. This records an interaction only; it does not imply the visitor felt or read anything beyond the recorded action.`;
    const result = await resend.emails.send({ from: process.env.EMAIL_FROM, to: process.env.NOTIFY_TO, subject, text: body });
    if (result.error) return res.status(502).json({ error: 'The email provider did not accept the message.' });
    res.json({ ok: true, message: 'The email provider accepted the notification request.' });
  } catch (e) {
    res.status(502).json({ error: 'Email sending failed. Please try again later.' });
  }
});
app.post('/api/photo', upload.single('photo'), async (req, res) => {
  if (!req.body?.consent || req.body.consent !== 'yes') return res.status(400).json({ error: 'Explicit consent is required.' });
  if (!req.file) return res.status(400).json({ error: 'Choose a valid JPG, PNG, or WebP image under 5 MB.' });
  const resend = getResend();
  if (!resend) return res.status(503).json({ error: 'Photo email is not configured yet. Your photo was not sent.' });
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.NOTIFY_TO,
      subject: 'Shakeeba birthday adventure — consented photo upload',
      text: 'The visitor consented to email this photo. This email contains the selected attachment. Temporary server copies are not saved by this endpoint.',
      attachments: [{ filename: req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100) || 'birthday-photo', content: req.file.buffer.toString('base64') }]
    });
    if (result.error) return res.status(502).json({ error: 'The email provider did not accept the photo email.' });
    res.json({ ok: true, message: 'The email provider accepted the photo email request.' });
  } catch {
    res.status(502).json({ error: 'Photo email failed. Please try again later.' });
  }
});
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Shakeeba adventure running on port ${PORT}`));
