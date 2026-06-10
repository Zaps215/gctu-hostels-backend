const { sendEmail } = require('./config/email');
require('dotenv').config();

async function test() {
    console.log('Sending test email...');
    
    const result = await sendEmail(
        'gctustudenthostels@gmail.com',  // Change to your email address
        'Test Email - GCTU Hostels',
        '<div style="font-family: Arial;"><h2>✅ Gmail SMTP Test</h2><p>If you see this, your email config is working!</p></div>'
    );
    
    console.log('Result:', result);
}

test();