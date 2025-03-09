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
    port: process.env.PORT || 8080
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Start server and set webhook
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not provided!');
    return;
  }

  try {
    // Delete any existing webhook
    await bot.deleteWebHook();
    
    // Set the new webhook if WEBHOOK_URL is provided
    if (process.env.WEBHOOK_URL) {
      console.log('Setting webhook to:', process.env.WEBHOOK_URL);
      const result = await bot.setWebHook(process.env.WEBHOOK_URL);
      
      if (result) {
        console.log('Webhook set successfully!');
      } else {
        console.error('Failed to set webhook');
      }
    } else {
      console.log('WEBHOOK_URL not provided, bot will work in polling mode');
      bot.startPolling();
    }
  } catch (error) {
    console.error('Error setting up bot:', error);
  }
});