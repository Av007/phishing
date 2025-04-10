import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // e.g., smtp.gmail.com
      port: 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: 'your_email@example.com',
        pass: 'your_email_password_or_app_password',
      },
    });
  }

  async sendMail(email: string, trackId: string) {
    const info = await this.transporter.sendMail({
      from: 'email@example.com',
      to: email,
      subject: 'This is not phishing',
      html: `<h1>This is not phishing <a href="https://local/${trackId}"></a></h1>`,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  }
}
