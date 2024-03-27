import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

let extra = {} as SMTPTransport.Options;
if (process.env.MAIL_AUTH_USERNAME) {
  extra.auth = {
    user: process.env.MAIL_AUTH_USERNAME,
    pass: process.env.MAIL_AUTH_PASSWORD,
  };
}

if (process.env.MAIL_TLS_REJECT_UNAUTHORIZED === 'false') {
  extra.tls = {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  };
}

if (process.env.MAIL_SECURE === 'false') {
  extra.secure = false;
}

const transporter = nodemailer.createTransport({
  ...extra,
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '465'),
});

export const send = async (options: Mail.Options) => {
  if (!process.env.MAIL_HOST) {
    console.log('SENDING EMAILS IS DISABLED');
    console.log(options);
    return;
  }

  await transporter.sendMail(options);
};
