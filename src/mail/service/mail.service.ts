import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}
  async sendPasswordResetLink(email: string, resetLink: string, name: string) {
    await this.mailer.sendMail({
      to: email,
      from: 'Zeyad@necommerce.io',
      template: 'reset-password',
      subject: 'Password Reset Link',
      text: `Please click on the link provided to reset your password ${resetLink}`,
      context: {
        name: name,
        url: resetLink,
      },
    });
  }
}
