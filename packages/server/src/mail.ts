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

if (process.env.MAIL_SECURE) {
  extra.secure = process.env.MAIL_SECURE === 'true';
}

if (process.env.MAIL_TLS_CIPHERS || process.env.MAIL_TLS_REJECT_UNAUTHORIZED) {
  extra.tls = {};

  if (process.env.MAIL_TLS_CIPHERS) {
    extra.tls.ciphers = process.env.MAIL_TLS_CIPHERS;
  }

  if (process.env.MAIL_TLS_REJECT_UNAUTHORIZED) {
    extra.tls.rejectUnauthorized =
      process.env.MAIL_TLS_REJECT_UNAUTHORIZED === 'true';
  }
}

if (process.env.MAIL_SECURE) {
  extra.secure = process.env.MAIL_SECURE === 'true';
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
