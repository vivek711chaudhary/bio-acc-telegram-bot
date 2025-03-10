const { generateAIResponse, generateCommunityContent, CommunityContentScheduler } = require('./messages');
const { quizQuestions, getRandomQuestion } = require('./quiz_questions');

/**
 * Escapes special characters for MarkdownV2 format
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeMarkdown(text) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

/**
 * Handles bot commands
 * @param {TelegramBot} bot - Telegram bot instance
 * @param {Object} message - Message object
 */
async function handleCommand(bot, message) {
  const command = message.text.split(' ')[0];
  const chatId = message.chat.id;
  const username = message.from.username || message.from.first_name;

  console.log('Handling command:', command, 'from chat:', chatId);

  try {
    switch (command) {
      case '/start':
        console.log('Sending start message to:', chatId);
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
          `💡 /insight \\- Get thought\\-provoking insights\n` +
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
          await bot.sendChatAction(chatId, 'typing');
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
        await handleDiscussCommand(bot, message);
        break;

      case '/insight':
        await handleInsightCommand(bot, message);
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
        await handleQuizCommand(bot, message);
        break;

      case '/challenge':
        await handleChallengeCommand(bot, message);
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
        console.log('Unknown command:', command);
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

/**
 * Handles discussion command
 * @param {TelegramBot} bot - Telegram bot instance
 * @param {Object} msg - Message object
 */
async function handleDiscussCommand(bot, msg) {
  const chatId = msg.chat.id;
  console.log('Handling command: /discuss from chat:', chatId);

  try {
    await bot.sendChatAction(chatId, 'typing');
    
    const discussionTopic = `💭 *BIO/ACC Discussion Topic*

🧬 *Radical Lifespan Extensions and Society*

🔬 *Key Points:*
• Gene editing and biotech advances
• AI\\-assisted longevity research
• Societal implications

🧪 *Current Progress:*
• CRISPR breakthroughs in aging
• Stem cell regeneration
• AI drug discovery

💡 *Discussion Questions:*
1\\. How should society adapt to 150\\+ year lifespans?
2\\. What changes needed in education/work?
3\\. Your thoughts on life extension ethics?

*Share your insights\\! 🗣️*

Started by @${msg.from.username || 'Anonymous'}`;

    await bot.sendMessage(chatId, discussionTopic, { 
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true
    });
  } catch (error) {
    console.error('Error starting discussion:', error);
    await bot.sendMessage(chatId, '❌ Sorry, there was an error starting the discussion\\. Please try again\\.', {
      parse_mode: 'MarkdownV2'
    });
  }
}

/**
 * Handles challenge command
 * @param {TelegramBot} bot - Telegram bot instance
 * @param {Object} msg - Message object
 */
async function handleChallengeCommand(bot, msg) {
  const chatId = msg.chat.id;
  console.log('Handling command: /challenge from chat:', chatId);

  try {
    // Simplified static challenges that rotate
    const challenges = [
      {
        title: "DIY Bioreactor Challenge",
        description: "Design a simple home bioreactor under $200 that can maintain temperature and pH levels.",
        requirements: "• Basic safety features\n• Temperature control\n• pH monitoring\n• Cost under $200",
        duration: "48 hours"
      },
      {
        title: "Biotech Documentation Challenge",
        description: "Create detailed documentation for a basic biotech experiment that others can replicate.",
        requirements: "• Step-by-step guide\n• Safety protocols\n• Required materials list\n• Expected results",
        duration: "72 hours"
      },
      {
        title: "Community Lab Design",
        description: "Design a minimal viable community lab setup for basic experiments.",
        requirements: "• Essential equipment list\n• Safety measures\n• Space requirements\n• Budget breakdown",
        duration: "48 hours"
      }
    ];

    // Pick a random challenge
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    const message = `🧬 BIO/ACC Challenge\n\n` +
      `${challenge.title}\n\n` +
      `${challenge.description}\n\n` +
      `Requirements:\n${challenge.requirements}\n\n` +
      `Duration: ${challenge.duration}\n` +
      `Started by: @${msg.from.username || 'Anonymous'}\n\n` +
      `Share your progress with #bioaccchallenge`;

    await bot.sendMessage(chatId, message, { 
      disable_web_page_preview: true
    });

  } catch (error) {
    console.error('Error in challenge command:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error creating the challenge. Please try again.');
  }
}

/**
 * Handles insight command
 * @param {TelegramBot} bot - Telegram bot instance
 * @param {Object} msg - Message object
 */
async function handleInsightCommand(bot, msg) {
  const chatId = msg.chat.id;
  console.log('Handling command: /insight from chat:', chatId);

  try {
    // Simplified static insights that rotate
    const insights = [
      {
        topic: "Decentralized Science (DeSci)",
        content: "DeSci is revolutionizing research by removing traditional gatekeepers and enabling direct community funding and collaboration.",
        question: "How might decentralized research accelerate scientific discoveries?"
      },
      {
        topic: "Biohacking Communities",
        content: "Community labs are making biotechnology accessible to everyone, fostering innovation outside traditional institutions.",
        question: "What potential breakthroughs could emerge from community-driven research?"
      },
      {
        topic: "Synthetic Biology",
        content: "The ability to program living organisms opens new possibilities for medicine, materials, and computing.",
        question: "How might synthetic biology reshape our relationship with nature?"
      }
    ];

    // Pick a random insight
    const insight = insights[Math.floor(Math.random() * insights.length)];
    
    const message = `🧬 *BIO/ACC Insight: ${insight.topic}*\n\n` +
      `${insight.content}\n\n` +
      `💭 *Discussion Question:*\n${insight.question}\n\n` +
      `Share your thoughts below!`;

    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

  } catch (error) {
    console.error('Error in insight command:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error sharing the insight. Please try again.');
  }
}

/**
 * Handles quiz command
 * @param {TelegramBot} bot - Telegram bot instance
 * @param {Object} msg - Message object
 */
async function handleQuizCommand(bot, msg) {
  const chatId = msg.chat.id;
  console.log('Handling command: /quiz from chat:', chatId);

  try {
    await bot.sendMessage(chatId, '🧬 *Generating BIO/ACC Quiz\\.\\.\\.*', { parse_mode: 'MarkdownV2' });

    // Get a random question from our quiz bank
    const quizData = getRandomQuestion();

    // Track active quizzes
    if (!global.activeQuizzes) {
      global.activeQuizzes = new Map();
    }

    const quizMessage = await bot.sendPoll(chatId, 
      quizData.question, 
      quizData.options,
      {
        type: 'quiz',
        correct_option_id: quizData.correctIndex,
        is_anonymous: false,
        explanation: quizData.explanation,
        open_period: 300 // 5 minutes
      }
    );

    // Store quiz info
    const quizId = `${chatId}_${quizMessage.message_id}`;
    global.activeQuizzes.set(quizId, {
      ...quizData,
      startTime: Date.now(),
      votes: new Map()
    });

  } catch (error) {
    console.error('Error in quiz command:', error);
    await bot.sendMessage(chatId, '❌ Sorry, there was an error generating the quiz\\. Please try again\\.', {
      parse_mode: 'MarkdownV2'
    });
  }
}

/**
 * Handles non-command messages (regular questions about BIO/ACC)
 * @param {TelegramBot} bot - Telegram bot instance
 * @param {Object} msg - Message object
 */
async function handleMessage(bot, msg) {
  if (!msg.text || msg.text.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const username = msg.from.username || 'Anonymous';
  
  try {
    await bot.sendChatAction(chatId, 'typing');
    
    // Check if the question is about BIO/ACC, DeSci, or science
    const isRelevantQuestion = msg.text.toLowerCase().match(/bio|acc|science|desci|tech|research|gene|crispr|synth|lab|experiment|data|study/);
    
    // Generate response to the user's question
    const response = await generateAIResponse(msg.text);
    
    // Format response with context if needed
    let formattedResponse;
    if (!isRelevantQuestion) {
      formattedResponse = `Hi @${username}! As a BIO/ACC bot, let me address this from a scientific perspective:\n\n${response}`;
    } else {
      formattedResponse = `Hi @${username}! Here's what I found about ${msg.text}:\n\n${response}`;
    }
    
    // Add reminder if the question seems off-topic
    if (!isRelevantQuestion) {
      formattedResponse += '\n\nRemember, I specialize in BIO/ACC, DeSci, biotechnology, and scientific advancement. Feel free to ask me about these topics!';
    }
    
    // Send as plain text without any markdown or formatting
    await bot.sendMessage(chatId, formattedResponse, { 
      disable_web_page_preview: true,
      parse_mode: undefined  // Explicitly disable any parsing mode
    });
  } catch (error) {
    console.error('Error processing message:', error);
    await bot.sendMessage(chatId, 'I can only provide information about BIO/ACC, DeSci, and related scientific topics. Please try asking a question about these areas.');
  }
}

/**
 * Test the bot's ability to send messages
 * @param {TelegramBot} bot - Telegram bot instance
 * @returns {boolean} Success status
 */
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

/**
 * Main bot initialization function
 * @param {TelegramBot} bot - Telegram bot instance
 */
function initBot(bot) {
  // Set up command handlers
  bot.on('message', async (msg) => {
    if (msg.text && msg.text.startsWith('/')) {
      await handleCommand(bot, msg);
    } else {
      await handleMessage(bot, msg);
    }
  });
  
  // Set up error handler
  bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
  });
  
  console.log('Bot initialized and ready to receive messages');
}

module.exports = {
  handleCommand,
  handleMessage,
  handleDiscussCommand,
  handleChallengeCommand,
  handleInsightCommand,
  handleQuizCommand,
  testBot,
  initBot,
  escapeMarkdown
};