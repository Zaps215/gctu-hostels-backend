const { BrevoClient } = require('@getbrevo/brevo');
require('dotenv').config();

// Initialize the client with your API key
const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

async function sendEmail(to, subject, html) {
    try {
        const result = await client.transactionalEmails.sendTransacEmail({
            subject: subject,
            htmlContent: html,
            sender: { name: 'GCTU StudentHostels', email: 'gctustudenthostels@smtp-brevo.com' },
            to: [{ email: to }]
        });
        console.log('Email sent:', result.messageId);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, message: error.message };
    }
}

module.exports = { sendEmail };