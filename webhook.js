const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { handleCommand } = require('./commands');
const { handleMessage } = require('./messages');

// Load environment variables
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Validate environment variables
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN not provided!');
  process.exit(1);
}

// Create a bot instance
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  webHook: {
    port: process.env.PORT || 3002
  }
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);
    
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

// Start server
const PORT = process.env.PORT || 3002;
const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  try {
    // Delete any existing webhook
    await bot.deleteWebHook();
    
    // Set the new webhook if WEBHOOK_URL is provided
    if (process.env.WEBHOOK_URL) {
      const webhookUrl = `${process.env.WEBHOOK_URL}/webhook`;
      console.log('Setting webhook to:', webhookUrl);
      const result = await bot.setWebHook(webhookUrl);
      
      if (result) {
        console.log('Webhook set successfully!');
      } else {
        console.error('Failed to set webhook');
        process.exit(1);
      }
    } else {
      console.log('WEBHOOK_URL not provided, bot will work in polling mode');
      bot.startPolling();
    }
  } catch (error) {
    console.error('Error setting up bot:', error);
    process.exit(1);
  }
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});