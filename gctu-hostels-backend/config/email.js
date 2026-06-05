const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: to,  // ← Change to your email
            subject: subject,
            html: html
        });

        if (error) {
             return { success: false, message: error.message };
        } 
            return {success: true, message: 'Email sent successfully'};
    } catch (error) {

        return { success: false, message: error.message };
    }
}


module.exports = {sendEmail};