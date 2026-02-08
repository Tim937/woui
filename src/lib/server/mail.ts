
import nodemailer from 'nodemailer';

import {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS} from '$env/static/private';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendInviteEmail(to: string, link: string, subject:string, message?:string) {
    await transporter.sendMail({
        from:SMTP_USER,
        to,
        subject,
        html:`
            ${message ? `<p>${message}</p>` : ''}
            <a href="${link}" target="_blank">Cliquer ici pour accéder à votre espace</a>
        `
    })
}