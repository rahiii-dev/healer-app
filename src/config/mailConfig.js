import nodemailer from 'nodemailer';
import environment from './environment';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth : {
        user: environment.MAIL_ID,
        pass: environment.MAIL_PASSWORD
    }
})

export default transporter