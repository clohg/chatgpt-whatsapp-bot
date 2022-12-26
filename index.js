require('dotenv').config();

const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  puppeteer: {
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true
  },
  authStrategy: new LocalAuth()
});

client.initialize();
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR code ready!");
});
client.on("authenticated", () => {
  console.log("Auth Completed!");
});
client.on("ready", () => {
  console.log("Bot is ready!");
});


(async () => {
  const { ChatGPTAPIBrowser } = await import('chatgpt');
  const api = new ChatGPTAPIBrowser({ 
    email: process.env.OPENAI_EMAIL,
    password: process.env.OPENAI_PASSWORD
  });

  try{
    await api.initSession();
  }
  catch(error){
    console.error("ChatGPT Auth Failed: " + error.message);
  }
})();

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

client.on("message", (message) => {

  (async () => {
    var response = await api.sendMessage(message);
    await sleep(5000);
    message.reply(response);
  })();

});