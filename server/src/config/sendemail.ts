// src/config/sendEmail.ts

import { google } from 'googleapis';

const getGmailService = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
};

const encodeMessage = (to: string, subject: string, message: string) => {
  const rawMessage = [
    `From: Resume Builder <${process.env.EMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    message,
  ].join('\n');

  return Buffer.from(rawMessage).toString('base64url');
};

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions) => {
  const gmail = await getGmailService();

  const encodedMessage = encodeMessage(options.email, options.subject, options.message);

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
};

export default sendEmail;