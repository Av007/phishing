import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    nodemailer.createTestAccount().then((testAccount) => {
      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    });
    
    // for real life
    // this.transporter = nodemailer.createTransport({
    //   host: 'smtp.example.com',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: 'your_email@example.com',
    //     pass: 'your_email_password_or_app_password',
    //   },
    // });
  }

  async sendMail(email: string, trackId: string) {
    const info = await this.transporter.sendMail({
      from: 'email@example.com',
      to: email,
      subject: 'This is not phishing',
      html: `<h1>This is not phishing <a href="https://localhost/${trackId}"></a></h1>`,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  }
}
