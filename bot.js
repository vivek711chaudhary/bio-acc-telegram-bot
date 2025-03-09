const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const fetch = require('node-fetch');
const { desciTopics, bioAccTopics } = require('./knowledge-base');
const { 
  getActiveDiscussions, 
  getUpcomingEvents, 
  formatDiscussionsForTelegram, 
  formatEventsForTelegram 
} = require('./community');
const { getLatestNews, formatNewsForTelegram } = require('./news');
const { generateResponse } = require('./together-ai');
const { handleCommand } = require('./commands');
const { handleMessage } = require('./messages');

// Create bot instance with webhook options
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  webHook: {
    port: process.env.PORT || 3003
  }
});

// Process incoming Telegram updates
function processUpdate(update) {
  try {
    const message = update.message;
    if (!message) return;

    // Handle commands
    if (message.text && message.text.startsWith('/')) {
      return handleCommand(bot, message);
    }

    // Handle regular messages
    return handleMessage(bot, message);
  } catch (error) {
    console.error('Error processing update:', error);
  }
}

// Handle callback queries
async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  
  try {
    // Acknowledge the callback query
    await bot.answerCallbackQuery(callbackQuery.id);
    
    switch (data) {
      case 'profile':
        await bot.sendMessage(chatId, "👤 <b>Your Profile</b>\n\nName: John Doe\nEmail: john@example.com\nMember since: January 2023", { parse_mode: "HTML" });
        break;
      case 'activity':
        await bot.sendMessage(chatId, "🔍 <b>Recent Activity</b>\n\n• Logged in 2 days ago\n• Updated profile picture\n• Completed 3 tasks", { parse_mode: "HTML" });
        break;
      case 'notifications':
        await bot.sendMessage(chatId, "🔔 <b>Notifications</b>\n\n• New feature available\n• System maintenance scheduled\n• Your subscription renews soon", { parse_mode: "HTML" });
        break;
      case 'desci_intro':
        await bot.sendMessage(chatId, desciTopics.introduction);
        break;
      case 'bioacc_intro':
        await bot.sendMessage(chatId, bioAccTopics.introduction);
        break;
      case 'desci_benefits':
        await bot.sendMessage(chatId, desciTopics.benefits);
        break;
      case 'desci_challenges':
        await bot.sendMessage(chatId, desciTopics.challenges);
        break;
      case 'desci_projects':
        await bot.sendMessage(chatId, desciTopics.projects);
        break;
      case 'bioacc_tech':
        await bot.sendMessage(chatId, bioAccTopics.technologies);
        break;
      case 'bioacc_ethics':
        await bot.sendMessage(chatId, bioAccTopics.ethics);
        break;
      case 'science_daos':
        await bot.sendMessage(chatId, 
          `<b>Science DAOs:</b>\n\n• VitaDAO - Focuses on longevity research\n• LabDAO - Building open wetlab infrastructure\n• PsyDAO - Psychedelic medicine research\n• BioDAO - General biotechnology advancement\n\nThese organizations use blockchain governance to collectively fund and direct scientific research.`,
          { parse_mode: "HTML" });
        break;
      case 'show_discussions':
        const discussions = getActiveDiscussions();
        await bot.sendMessage(chatId, formatDiscussionsForTelegram(discussions), { parse_mode: "HTML" });
        break;
      case 'show_events':
        const events = getUpcomingEvents();
        await bot.sendMessage(chatId, formatEventsForTelegram(events), { parse_mode: "HTML" });
        break;
      default:
        await bot.sendMessage(chatId, "Unknown option selected.");
    }
  } catch (error) {
    console.error('Error handling callback query:', error);
  }
}

// Set webhook
async function setWebhook(url) {
  try {
    // Remove any existing webhook first
    await bot.deleteWebHook();
    // Set the new webhook
    const result = await bot.setWebHook(url);
    return result;
  } catch (error) {
    console.error('Error setting webhook:', error);
    throw error;
  }
}

module.exports = {
  bot,
  processUpdate,
  setWebhook
}; 