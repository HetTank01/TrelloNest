import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hettank34@gmail.com',
      pass: 'irghowmpofcosnoh',
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: 'hettank34@gmail.com',
      to,
      subject,
      text,
    });

    return info;
  }
}
