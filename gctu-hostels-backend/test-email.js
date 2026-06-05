const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'gctu-hostels@resend.dev',
            to: 'emmanuelananga2021@gmail.com',  // ← Change to your email
            subject: 'Test Email from GCTU Hostels',
            html: '<strong>✅ Your backend can send emails! OTP system coming soon.</strong>'
        });

        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Success:', data);
        }
    } catch (err) {
        console.error('Failed:', err);
    }
}

sendTestEmail();