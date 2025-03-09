const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { handleCommand } = require('./commands');
const { handleMessage } = require('./messages');

// Load environment variables
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Create a bot instance with webhook options
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  webHook: {
    port: process.env.PORT || 3000
  }
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message); // Debug log
    
    if (!message) {
      return res.sendStatus(200);
    }

    if (message.text && message.text.startsWith('/')) {
      await handleCommand(bot, message);
    } else if (message.text) {
      await handleMessage(bot, message);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling update:', error);
    res.sendStatus(500);
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Bot is running!');
});

// Start server and set webhook
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Set webhook
  try {
    // Delete any existing webhook
    await bot.deleteWebHook();
    
    // Set the new webhook
    const webhookUrl = process.env.WEBHOOK_URL;
    console.log('Setting webhook to:', webhookUrl);
    const result = await bot.setWebHook(webhookUrl);
    
    if (result) {
      console.log('Webhook set successfully!');
    } else {
      console.error('Failed to set webhook');
    }
    
    // Get webhook info for debugging
    const webhookInfo = await bot.getWebHookInfo();
    console.log('Webhook info:', webhookInfo);
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
});