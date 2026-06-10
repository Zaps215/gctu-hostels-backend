const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Increased timeouts slightly to accommodate Render's cold starts
    connectionTimeout: 15000, 
    socketTimeout: 15000,
    greetingTimeout: 15000,
    // This tells Nodemailer how to handle underlying stream issues
    tls: {
        // Force Node to prefer IPv4 when establishing the TLS stream
        family: 4,
        // Prevents failure if Render has local SSL handshake discrepancies
        rejectUnauthorized: false 
    }
});

async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"GCTU StudentHostels" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        });

        console.log('Email sent:', info.messageId);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, message: error.message };
    }
}

module.exports = { sendEmail };