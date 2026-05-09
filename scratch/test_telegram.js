// Using Node.js native --env-file support

const BOT_TOKEN = process.env.WATCHIT_TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

if (!BOT_TOKEN || !CHANNEL_ID) {
  console.error('Error: Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID in your .env file.');
  process.exit(1);
}

async function test() {
  console.log('--- Telegram Test Script ---');
  console.log(`Using Token: ${BOT_TOKEN.substring(0, 5)}...`);
  console.log(`Using Channel ID: ${CHANNEL_ID}`);

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: '🔔 <b>Test Notification</b>\nIf you see this, your bot configuration is correct!',
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    if (data.ok) {
      console.log('✅ Success! Message sent.');
    } else {
      console.log('❌ Failed!');
      console.log(`Error Code: ${data.error_code}`);
      console.log(`Description: ${data.description}`);
      
      if (data.description === 'chat not found') {
        console.log('\n💡 TIPS:');
        console.log('1. Make sure the bot is an ADMINISTRATOR in the channel.');
        console.log('2. Double check if the Channel ID is correct.');
        console.log('3. If it is a private channel, you must use the numerical ID (starts with -100).');
      }
    }
  } catch (err) {
    console.error('Network Error:', err);
  }
}

test();
