const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');
require('dotenv').config();

// Initialize the API client and set the API key
let emailAPI = new TransactionalEmailsApi();
emailAPI.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

async function sendEmail(to, subject, html) {
    try {
        // Create a new email message object
        let message = new SendSmtpEmail();
        message.subject = subject;
        message.htmlContent = html;
        message.sender = { 
            name: 'GCTU StudentHostels', 
            email: 'ae4ae2001@smtp-brevo.com' 
        };
        message.to = [{ email: to }];
        // Send the email using the API
        const data = await emailAPI.sendTransacEmail(message);
        console.log('Email sent successfully!', data);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, message: error.message };
    }
}

module.exports = { sendEmail };