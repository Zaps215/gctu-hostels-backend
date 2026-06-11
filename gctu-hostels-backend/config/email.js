const brevo = require('@getbrevo/brevo');
require('dotenv').config();

let apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

async function sendEmail(to, subject, html) {
    try {
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.sender = { 
            name: 'GCTU StudentHostels', 
            email: 'ae4ae2001@smtp-brevo.com'  // Your Brevo sender email
        };
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html;

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent:', data.messageId);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, message: error.message };
    }
}

module.exports = { sendEmail };