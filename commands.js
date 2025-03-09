const { generateAIResponse, generateCommunityContent, CommunityContentScheduler } = require('./messages');

function escapeMarkdown(text) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

async function handleCommand(bot, message) {
  const command = message.text.split(' ')[0];
  const chatId = message.chat.id;
  const username = message.from.username || message.from.first_name;

  console.log('Handling command:', command, 'from chat:', chatId); // Debug log

  try {
    switch (command) {
      case '/start':
        console.log('Sending start message to:', chatId); // Debug log
        await bot.sendMessage(chatId, 
          'Welcome to Bio/ACC bot\\! 🧬\nUse /help to see available commands\\.', 
          { parse_mode: 'MarkdownV2' }
        );
        break;

      case '/help':
        await bot.sendMessage(chatId, 
          `🤖 *BioACC Bot Commands*\n\n` +
          `*Basic Commands:*\n` +
          `🏠 /start \\- Start the bot\n` +
          `ℹ️ /help \\- Show this help message\n` +
          `🧬 /explain\\_acc \\- Learn about BIO/ACC\n\n` +
          `*Community Commands:*\n` +
          `🎯 /meme \\- Get a BIO/ACC meme\n` +
          `💭 /discuss \\- Start a discussion\n` +
          `📊 /poll \\- Create a community poll\n` +
          `🧠 /quiz \\- Start a BIO/ACC quiz\n` +
          `🏆 /challenge \\- Start a challenge\n` +
          `📰 /news \\- Get latest BIO/ACC news\n` +
          `📅 /schedule \\- Set up automated content\n\n` +
          `You can also ask me questions about:\n` +
          `• BIO/ACC movement\n` +
          `• DeSci projects\n` +
          `• Research papers\n` +
          `• Biotechnology\n` +
          `• Transhumanism`,
          { 
            parse_mode: 'MarkdownV2',
            disable_web_page_preview: true
          }
        );
        break;

      case '/explain_acc':
        try {
          const response = await generateAIResponse("What is BIO/ACC? Explain it simply.");
          await bot.sendMessage(chatId, escapeMarkdown(response), { 
            parse_mode: 'MarkdownV2',
            disable_web_page_preview: true
          });
        } catch (error) {
          console.error('Error:', error);
          await bot.sendMessage(chatId, 'Sorry, there was an error processing your request\\.', {
            parse_mode: 'MarkdownV2'
          });
        }
        break;

      case '/meme':
        try {
          await bot.sendChatAction(chatId, 'typing');
          const memeContent = await generateCommunityContent('meme');
          await bot.sendMessage(chatId, memeContent, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true
          });
        } catch (error) {
          console.error('Error generating meme:', error);
          await bot.sendMessage(chatId, 'Sorry, there was an error generating the meme content.');
        }
        break;

      case '/discuss':
        try {
          await bot.sendChatAction(chatId, 'typing');
          const discussionContent = await generateCommunityContent('discussion');
          await bot.sendMessage(chatId, `💭 *Discussion Topic*\n\n${discussionContent}\n\n👥 Started by @${username}`, {
            parse_mode: 'Markdown'
          });
        } catch (error) {
          console.error('Error starting discussion:', error);
          await bot.sendMessage(chatId, 'Sorry, there was an error starting the discussion.');
        }
        break;

      case '/poll':
        try {
          await bot.sendChatAction(chatId, 'typing');
          const question = "📊 Which of these is the most important BIO/ACC priority?";
          const options = [
            "Democratizing biotech 🧬",
            "Regulatory reform ⚖️",
            "Funding research 💰",
            "Public education 📚"
          ];
          
          await bot.sendPoll(chatId, question, options, {
            is_anonymous: false,
            allows_multiple_answers: false
          });
        } catch (error) {
          console.error('Error creating poll:', error);
          await bot.sendMessage(chatId, 'Sorry, there was an error creating the poll.');
        }
        break;

      case '/quiz':
        try {
          await bot.sendChatAction(chatId, 'typing');
          const question = "🧬 Which technique revolutionized gene editing in 2012?";
          const options = [
            "CRISPR-Cas9",
            "PCR",
            "mRNA",
            "DNA Sequencing"
          ];
          
          await bot.sendPoll(chatId, question, options, {
            type: 'quiz',
            correct_option_id: 0,
            explanation: "CRISPR-Cas9 was discovered in 2012 and revolutionized gene editing by making it more precise, efficient, and cost-effective.",
            is_anonymous: false
          });
        } catch (error) {
          console.error('Error creating quiz:', error);
          await bot.sendMessage(chatId, 'Sorry, there was an error creating the quiz.');
        }
        break;

      case '/challenge':
        try {
          await bot.sendChatAction(chatId, 'typing');
          const challengeContent = await generateCommunityContent('challenge');
          await bot.sendMessage(chatId, `🏆 *BIO/ACC Challenge*\n\n${challengeContent}\n\nShare your response in the chat!`, {
            parse_mode: 'Markdown'
          });
        } catch (error) {
          console.error('Error creating challenge:', error);
          await bot.sendMessage(chatId, 'Sorry, there was an error creating the challenge.');
        }
        break;

      case '/news':
        try {
          await bot.sendChatAction(chatId, 'typing');
          const newsContent = await generateCommunityContent('news');
          await bot.sendMessage(chatId, `📰 *BIO/ACC News Update*\n\n${newsContent}`, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true
          });
        } catch (error) {
          console.error('Error generating news:', error);
          await bot.sendMessage(chatId, 'Sorry, there was an error generating the news update.');
        }
        break;

      case '/schedule':
        if (!global.contentScheduler) {
          global.contentScheduler = new CommunityContentScheduler(bot);
        }
        global.contentScheduler.addChat(chatId);
        await bot.sendMessage(chatId, 
          '📅 *Automated Content Schedule*\n\n' +
          '• Memes: Monday & Thursday at 12 PM\n' +
          '• Discussions: Tuesday & Friday at 10 AM\n' +
          '• News: Wednesday & Saturday at 9 AM\n' +
          '• Polls: Sunday & Wednesday at 6 PM\n' +
          '• Quiz: Tuesday at 7 PM\n' +
          '• Challenges: Friday at 3 PM\n\n' +
          'You will now receive automated content according to this schedule!',
          { parse_mode: 'Markdown' }
        );
        break;

      default:
        console.log('Unknown command:', command); // Debug log
        await bot.sendMessage(chatId, 'Unknown command. Use /help to see available commands.');
    }
  } catch (error) {
    console.error('Error in handleCommand:', error);
    try {
      await bot.sendMessage(chatId, 
        'Sorry, I encountered an error processing your command. Please try again later.',
        { parse_mode: 'Markdown' }
      );
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
    }
  }
}

// Test the bot's ability to send messages
async function testBot(bot) {
  try {
    const me = await bot.getMe();
    console.log('Bot info:', me);
    return true;
  } catch (error) {
    console.error('Bot test failed:', error);
    return false;
  }
}

module.exports = {
  handleCommand,
  testBot
}; 