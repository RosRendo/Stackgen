import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey || apiKey.trim() === '') {
    console.error('❌ Error: RESEND_API_KEY is not set in your .env file!');
    process.exit(1);
  }

  console.log('Testing Resend connection with API Key:', apiKey.substring(0, 8) + '...');
  
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'StackGen <noreply@stackgen.site>',
      to: 'rousrendo@gmail.com', // Sending a test email to your admin address
      subject: 'Resend API Test - Success!',
      html: '<p>If you are reading this, your Resend API Key is working perfectly!</p>'
    });

    if (error) {
      console.error('❌ Failed to send email. Resend Error:', error);
      return;
    }

    console.log('✅ Success! Email sent. ID:', data?.id);
    console.log('Check your inbox at rousrendo@gmail.com');
  } catch (err) {
    console.error('❌ Unexpected Error:', err);
  }
}

testEmail();
