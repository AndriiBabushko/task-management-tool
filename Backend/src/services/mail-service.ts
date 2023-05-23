import { createTransport } from "nodemailer";

class MailService {
  transporter;

  constructService() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to: string, link: string) {
    this.constructService();

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Account activation on " + process.env.API_URL,
      text: "",
      html: `
        <div>
          <h1>To activate the account go to this link:</h1>
          <a href="${link}">${link}</a>
        </div>
            `,
    });
  }
}

export default new MailService();
