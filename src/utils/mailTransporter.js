import nodemailer from 'nodemailer';
import environment from '../config/environment.js';

const mailTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth : {
        user: environment.MAIL_ID,
        pass: environment.MAIL_PASSWORD
    }
})

export default mailTransporter