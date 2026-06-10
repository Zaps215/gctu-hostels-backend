const nodemailer = require('nodemailer');
const dns = require('dns');
require('dotenv').config();

// Force IPv4 for Gmail SMTP - MUST be BEFORE transporter creation
const originalResolve = dns.resolve;
dns.resolve = function(hostname, callback) {
    if (hostname === 'smtp.gmail.com') {
        // Gmail's IPv4 address
        callback(null, ['142.250.27.108']);
    } else {
        originalResolve(hostname, callback);
    }
};

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    socketTimeout: 10000
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