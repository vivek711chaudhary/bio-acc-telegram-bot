const SYSTEM_PROMPT = `You are BioACC Bot, an expert AI assistant focused on BIO/ACC (Biological Accelerationism) and related fields.

CORE CAPABILITIES:
1. Deep Knowledge Base:
   - BIO/ACC philosophy and principles
   - Biotechnology and genetic engineering
   - Transhumanism and human enhancement
   - DeSci (Decentralized Science)
   - Synthetic biology and bioengineering
   - Scientific research and papers
   - Community developments and culture

2. Contextual Understanding:
   - Maintain conversation context
   - Build upon previous messages
   - Remember user's focus areas
   - Connect related concepts

3. Response Quality:
   - Always provide detailed, substantive answers
   - Include specific examples and references
   - Use technical terms appropriately
   - Break down complex concepts
   - Format with clear sections and bullet points
   - Use emoji for better visual organization (🧬 🔬 🧪 🧫 🦠 🤖 🦾)

4. Scientific Accuracy:
   - Reference current research
   - Cite specific studies when relevant
   - Explain technical concepts clearly
   - Acknowledge uncertainties
   
5. Community Engagement:
   - Generate discussion topics and questions
   - Create and share memes relevant to BIO/ACC
   - Post news summaries and updates
   - Respond to specific users by name
   - Adapt response length based on context
   - Conduct polls, quizzes, and challenges

RESPONSE STRUCTURE:
1. 🧬 Core Explanation
2. 🔬 Technical Details
3. 🧪 Real-world Examples
4. 🧫 Related Concepts
5. 🦠 Current Developments
6. 🦾 Practical Implications

IMPORTANT HANDLING INSTRUCTIONS:
- If you encounter an error or cannot generate a complete response, provide a partial response rather than failing completely
- For complex topics, break down your response into manageable sections
- If a specific word count is requested, aim to meet it by providing substantive content
- Never respond with 'Unable to generate a sufficiently detailed response'
- If the query is too broad, still provide a general overview of the topic
- Always attempt to answer within your knowledge domain
- Use appropriate emojis to enhance readability and engagement
- When replying to a specific user, mention their name at the beginning
- Adapt response length dynamically based on context clues (detailed, medium, brief)`;

async function generateAIResponse(query, context = [], type = 'general', userMention = null, lengthPreference = 'auto') {
  try {
    // Build context from previous messages
    const conversationContext = context.length > 0 
      ? `Previous conversation context:\n${context.join('\n')}\n\n`
      : '';

    // Detect query type and requirements
    const isDetailedRequest = query.toLowerCase().includes('in detail') || 
                            query.toLowerCase().includes('explain') ||
                            query.toLowerCase().includes('words') ||
                            query.toLowerCase().includes('elaborate') ||
                            query.toLowerCase().includes('comprehensive');
    
    const isShortRequest = query.toLowerCase().includes('briefly') ||
                         query.toLowerCase().includes('short answer') ||
                         query.toLowerCase().includes('quick') ||
                         query.toLowerCase().includes('summarize');
    
    const wordCountMatch = query.match(/(\d+)\s*words/);
    const requestedWordCount = wordCountMatch ? parseInt(wordCountMatch[1]) : 0;

    // Calculate appropriate token length based on detected preferences
    let targetTokens = 0;
    
    if (lengthPreference === 'auto') {
      if (requestedWordCount) {
        targetTokens = requestedWordCount * 2;
      } else if (isDetailedRequest) {
        targetTokens = 2000;
      } else if (isShortRequest) {
        targetTokens = 600;
      } else {
        targetTokens = 1200; // medium default
      }
    } else if (lengthPreference === 'detailed') {
      targetTokens = 2000;
    } else if (lengthPreference === 'brief') {
      targetTokens = 600;
    } else {
      targetTokens = 1200; // medium default
    }

    // Extract the core question by removing word count requirements
    const coreQuestion = query.replace(/\s*in\s+\d+\s+words\s*/i, ' ');

    // User mention formatting
    const userGreeting = userMention ? `@${userMention}, ` : '';

    let enhancedPrompt = '';
    
    switch(type) {
      case 'detailed':
        enhancedPrompt = `Provide a comprehensive analysis of: ${coreQuestion}

        ${userMention ? `This is a direct reply to user @${userMention}. Start your response addressing them.` : ''}

        Required sections with emoji headers:
        1. 🧬 Core Concepts and Principles
        2. 🔬 Technical Details and Mechanisms
        3. 🧪 Research and Developments
        4. 🧫 Practical Applications
        5. 🦠 Future Implications
        6. 🦾 Connections to BIO/ACC Philosophy

        Format your response with clear headers, bullet points where appropriate, and relevant emojis to enhance readability.
        
        ${conversationContext}
        Include specific examples, technical details, and real-world applications.
        ${requestedWordCount ? `Target length: approximately ${requestedWordCount} words.` : ''}`;
        break;

      case 'technical':
        enhancedPrompt = `Provide a technical analysis of: ${coreQuestion}

        ${userMention ? `This is a direct reply to user @${userMention}. Start your response addressing them.` : ''}

        Include these sections with emoji headers:
        - 🧬 Scientific Principles and Mechanisms
        - 🔬 Technical Specifications
        - 🧪 Research Evidence
        - 🧫 Implementation Details
        - 🦠 Current Limitations and Challenges
        - 🦾 Future Developments

        Format your response with clear headers, bullet points for technical details, and relevant emojis to enhance readability.
        
        ${conversationContext}
        ${requestedWordCount ? `Target length: approximately ${requestedWordCount} words.` : ''}`;
        break;

      case 'community':
        enhancedPrompt = `Generate engaging community content: ${coreQuestion}

        ${userMention ? `This is a direct reply to user @${userMention}. Start your response addressing them.` : ''}

        Create content that is:
        - Engaging and conversation-starting
        - Relevant to BIO/ACC interests
        - Educational yet accessible
        - Formatted with emojis for visual appeal
        
        ${conversationContext}
        ${requestedWordCount ? `Target length: approximately ${requestedWordCount} words.` : ''}`;
        break;

      default:
        enhancedPrompt = `Provide a detailed response about: ${coreQuestion}

        ${userMention ? `This is a direct reply to user @${userMention}. Start your response addressing them.` : ''}

        Requirements:
        - Clear explanation of concepts
        - Specific examples and references
        - Technical accuracy
        - Practical implications
        - Connections to related topics
        ${requestedWordCount ? `- Target length: approximately ${requestedWordCount} words` : ''}

        Format your response with emoji headers (🧬 🔬 🧪 🧫 🦠 🦾), bullet points where appropriate, and relevant emojis to enhance readability.
        
        ${conversationContext}
        If you cannot provide a complete response, provide the most helpful partial response possible.`;
    }

    // Implementing retry logic with fallback strategies
    let attemptCount = 0;
    let generatedText = '';
    const maxAttempts = 3;

    while (attemptCount < maxAttempts && (!generatedText || generatedText.length < 100)) {
      attemptCount++;
      
      // Adjust temperature based on attempt number
      const temperature = 0.7 + (attemptCount * 0.1); // Increase randomness with each attempt
      
      // For retry attempts, simplify the prompt
      const retryPrompt = attemptCount > 1 ? 
        `You are an expert on BIO/ACC and related topics. ${userMention ? `This is a reply to @${userMention}. ` : ''}Please provide information about: ${coreQuestion}. Use emojis like 🧬 🔬 🧪 🧫 🦠 🦾 in your response for better readability.` :
        enhancedPrompt;
        
      try {
        const response = await fetch('https://api.together.xyz/v1/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            prompt: `${SYSTEM_PROMPT}\n\nUser: ${retryPrompt}\nAssistant:`,
            max_tokens: Math.min(4000, targetTokens), // Increased max tokens
            temperature: temperature,
            top_p: 0.9,
            top_k: 50,
            stop: ['User:', '\n\n\n']
          })
        });

        const data = await response.json();
        if (data.error) {
          console.error(`Together AI error (attempt ${attemptCount}):`, data.error);
          continue; // Try again with different parameters
        }

        generatedText = data.choices[0].text.trim();
        
        // If we have some content, break the loop
        if (generatedText && generatedText.length >= 100) {
          break;
        }
      } catch (error) {
        console.error(`Error in attempt ${attemptCount}:`, error);
      }
      
      // Wait briefly before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Fallback response if all attempts failed
    if (!generatedText || generatedText.length < 100) {
      return `${userGreeting}🧬 *BIO/ACC Topic: ${coreQuestion}*\n\nI understand you're interested in this fascinating area of biological accelerationism. While I'm currently having trouble generating a complete response, here's what I can tell you:\n\n🔬 BIO/ACC explores enhancing human capabilities through advanced biotechnology\n🧪 It sits at the intersection of transhumanism and accelerationist philosophy\n🦾 Would you like me to try answering a more specific aspect of this topic?`;
    }

    // Enhanced UI formatting: Add emoji to headers if not present
    let enhancedText = generatedText;
    
    // Add user mention at the start if provided and not already included
    if (userMention && !enhancedText.toLowerCase().includes(`@${userMention.toLowerCase()}`)) {
      enhancedText = `${userGreeting}${enhancedText}`;
    }
    
    // Replace simple headers with emoji headers if they don't have emojis already
    if (!enhancedText.includes('# 🧬') && !enhancedText.includes('## 🧬')) {
      // Define emoji mapping for different header topics
      const emojiMap = {
        'introduction': '🧬',
        'overview': '🧬',
        'core': '🧬',
        'concept': '🧬',
        'technical': '🔬',
        'detail': '🔬',
        'mechanism': '🔬',
        'research': '🧪',
        'example': '🧪',
        'application': '🧫',
        'related': '🧫',
        'current': '🦠',
        'development': '🦠',
        'future': '🦠',
        'practical': '🦾',
        'implication': '🦾',
        'conclusion': '🦾',
        'quiz': '🧠',
        'poll': '📊',
        'challenge': '🏆',
        'news': '📰',
        'discussion': '💬',
        'topic': '🗣️',
        'meme': '😂'
      };
      
      // Process headers with regex
      enhancedText = enhancedText.replace(/(?:^|\n)(#+\s*)([^#\n]+)/g, (match, headerMarks, headerText) => {
        // Check if header already has an emoji
        if (/[\u{1F300}-\u{1F6FF}]/u.test(headerText)) {
          return match;
        }
        
        // Find appropriate emoji for this header
        let emoji = '🧬'; // Default emoji
        const headerLower = headerText.toLowerCase();
        for (const [keyword, specificEmoji] of Object.entries(emojiMap)) {
          if (headerLower.includes(keyword)) {
            emoji = specificEmoji;
            break;
          }
        }
        
        return `${headerMarks}${emoji} ${headerText.trim()}`;
      });
    }
    
    // Add bullet point emojis if not present
    if (!enhancedText.includes('• ') && !enhancedText.includes('- 🔹')) {
      enhancedText = enhancedText.replace(/(?:^|\n)([•-]\s+)([^\n]+)/g, (match, bullet, text) => {
        return `${bullet}🔹 ${text}`;
      });
    }
    
    // Add intro emoji and enhancement to the beginning if there's no header
    if (!enhancedText.startsWith('#') && !enhancedText.includes('🧬') && !enhancedText.startsWith(userGreeting)) {
      enhancedText = `${userGreeting}🧬 *${capitalizeFirstWord(coreQuestion)}*\n\n${enhancedText}`;
    }
    
    // Add a conclusion emoji at the end if there isn't one already
    if (!enhancedText.endsWith('🦾') && !enhancedText.includes('🦾 Conclusion') && 
        !enhancedText.includes('🦾 Summary') && enhancedText.length > 500) {
      enhancedText += `\n\n🦾 *Key Takeaway:* ${coreQuestion} represents a critical area in the BIO/ACC framework, bridging biological innovation with accelerationist philosophy.`;
    }

    // Validate and handle word count requirement
    if (requestedWordCount) {
      const currentWordCount = enhancedText.split(/\s+/).length;
      
      // If we're significantly under the requested word count, try to extend the response
      if (currentWordCount < requestedWordCount * 0.7 && currentWordCount > 100) {
        try {
          const expansionPrompt = `Continue the following text about ${coreQuestion} to reach approximately ${requestedWordCount} words total. Current word count is about ${currentWordCount}. Focus on adding more examples, details, and implications. Use emojis for formatting. Here's the current text to continue:\n\n${enhancedText.substring(0, 500)}...`;
          
          const expansionResponse = await fetch('https://api.together.xyz/v1/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
              prompt: `${SYSTEM_PROMPT}\n\nUser: ${expansionPrompt}\nAssistant:`,
              max_tokens: 2000,
              temperature: 0.7,
              top_p: 0.9,
              top_k: 50,
              stop: ['User:', '\n\n\n']
            })
          });
          
          const expansionData = await expansionResponse.json();
          if (!expansionData.error) {
            const additionalText = expansionData.choices[0].text.trim();
            if (additionalText && additionalText.length > 100) {
              enhancedText += '\n\n' + additionalText;
            }
          }
        } catch (error) {
          console.error('Error generating expansion:', error);
          // Continue with what we have if expansion fails
        }
      }
    }

    return enhancedText;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return `${userMention ? `@${userMention}, ` : ''}🧬 *BIO/ACC Information*\n\nI apologize, but I encountered a technical issue. Here\'s what I can tell you briefly:\n\n🔬 BIO/ACC refers to Biological Accelerationism, which explores enhancing human biology through advanced technology\n🧪 It encompasses gene editing, synthetic biology, and human augmentation\n🦾 Would you like me to try answering a more specific question about this topic?`;
  }
}

// Helper function to capitalize first word
function capitalizeFirstWord(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Enhanced message context storage with user tracking
const messageContext = new Map();
const userActivity = new Map(); // Track user activity for better engagement

// New function to generate community content
async function generateCommunityContent(contentType) {
  const topics = {
    'meme': [
      "Create a humorous meme about gene editing being the new 'updating your OS'",
      "Make a meme comparing lab-grown meat to traditional farming with a twist",
      "Design a meme about transhumanists discussing weekend body upgrades",
      "Create a meme about biohackers troubleshooting their implants",
      "Make a humorous meme about CRISPR being nature's 'find and replace' function"
    ],
    'discussion': [
      "What ethical boundaries should exist in human augmentation?",
      "How might decentralized science (DeSci) transform the biotech industry?",
      "Which biological enhancement would you personally consider, and why?",
      "How might society adapt to radically extended human lifespans?",
      "What biotechnologies might emerge in the next decade that could transform medicine?"
    ],
    'news': [
      "Summarize the latest breakthrough in synthetic biology research",
      "Share updates about recent developments in brain-computer interfaces",
      "Highlight recent policy changes affecting genetic engineering research",
      "Share news about community-funded biotech research initiatives",
      "Report on recent advances in longevity research and anti-aging therapies"
    ],
    'poll': [
      "Poll: Which area of biotechnology has the most transformative potential? A) Gene editing B) Synthetic organs C) Brain-computer interfaces D) Longevity tech",
      "Poll: Would you consider genetic enhancement for your future children? A) Yes B) No C) Only for medical purposes D) Undecided",
      "Poll: Which biohacking technology would you try first? A) NFC implants B) Nootropics C) CRISPR self-experimentation D) None",
      "Poll: Most important BIO/ACC priority? A) Democratizing biotech B) Regulatory reform C) Funding research D) Public education",
      "Poll: Timeline for first human with 150+ year lifespan? A) Already born B) 2030-2050 C) 2050-2100 D) Never possible"
    ],
    'quiz': [
      "BIO/ACC Quiz: What technique revolutionized gene editing in 2012? A) PCR B) CRISPR C) mRNA D) Cloning",
      "Quiz: Which scientist pioneered mRNA vaccine technology? A) Jennifer Doudna B) Katalin Karikó C) George Church D) Craig Venter",
      "Test your knowledge: Which company created the first lab-grown beef burger? A) Beyond Meat B) Memphis Meats C) Mosa Meat D) Perfect Day",
      "BIO/ACC Quiz: Which of these is NOT a form of biohacking? A) Nutrigenomics B) Grinder implants C) Quantum entanglement D) Nootropics",
      "Quick Quiz: Which landmark biology project was completed in 2003? A) Human Genome Project B) Brain Initiative C) Human Cell Atlas D) Human Microbiome Project"
    ],
    'challenge': [
      "Challenge: Share your vision of human enhancement in 280 characters or less!",
      "Weekly challenge: Design a hypothetical biotech solution to a current environmental problem",
      "BIO/ACC Challenge: Describe a day in the life of a human in 2073 after radical biotechnology has transformed society",
      "Creative challenge: Pitch a science fiction story premise based on a real emerging biotechnology",
      "Community challenge: Explain a complex biotech concept to a 10-year-old (responses will be judged on clarity and accuracy)"
    ]
  };
  
  // Pick a random prompt from the category
  const prompts = topics[contentType] || topics['discussion'];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  
  // Generate content based on the prompt
  return await generateAIResponse(randomPrompt, [], 'community', null, contentType === 'meme' ? 'brief' : 'medium');
}

// Community content scheduler
class CommunityContentScheduler {
  constructor(bot) {
    this.bot = bot;
    this.chatIds = new Set(); // Store chat IDs where the bot is active
    this.schedules = {
      'meme': { dayOfWeek: [1, 4], hour: 12 },         // Monday & Thursday at noon
      'discussion': { dayOfWeek: [2, 5], hour: 10 },   // Tuesday & Friday at 10am
      'news': { dayOfWeek: [3, 6], hour: 9 },          // Wednesday & Saturday at 9am
      'poll': { dayOfWeek: [0, 3], hour: 18 },         // Sunday & Wednesday at 6pm
      'quiz': { dayOfWeek: [2], hour: 19 },            // Tuesday at 7pm
      'challenge': { dayOfWeek: [5], hour: 15 }        // Friday at 3pm
    };
    this.running = false;
  }
  
  addChat(chatId) {
    this.chatIds.add(chatId);
  }
  
  start() {
    if (this.running) return;
    
    this.running = true;
    this.intervalId = setInterval(() => this.checkSchedule(), 60 * 60 * 1000); // Check hourly
    console.log('Community content scheduler started');
  }
  
  stop() {
    clearInterval(this.intervalId);
    this.running = false;
    console.log('Community content scheduler stopped');
  }
  
  async checkSchedule() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 is Sunday
    
    for (const [contentType, schedule] of Object.entries(this.schedules)) {
      if (schedule.dayOfWeek.includes(currentDay) && schedule.hour === currentHour) {
        console.log(`Scheduling ${contentType} content for delivery`);
        
        try {
          const content = await generateCommunityContent(contentType);
          
          // Format based on content type
          let formattedContent = content;
          
          // Special formatting for polls
          if (contentType === 'poll' && this.bot.telegram) {
            // Extract poll options from content
            const pollMatch = content.match(/A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)(\s|$)/s);
            if (pollMatch) {
              const question = content.split('?')[0] + '?';
              const options = [pollMatch[1].trim(), pollMatch[2].trim(), pollMatch[3].trim(), pollMatch[4].trim()];
              
              // Send actual poll through Telegram
              for (const chatId of this.chatIds) {
                try {
                  this.bot.telegram.sendPoll(chatId, question, options, { is_anonymous: false });
                  await new Promise(resolve => setTimeout(resolve, 500)); // Throttle
                } catch (error) {
                  console.error(`Failed to send poll to chat ${chatId}:`, error);
                }
              }
              continue; // Skip regular sending for polls
            }
          }
          
          // For all other content types, send as message
          for (const chatId of this.chatIds) {
            try {
              // Split message if needed
              const chunks = splitMessage(formattedContent, 4000);
              for (const chunk of chunks) {
                if (chunk.trim()) {
                  await this.bot.telegram.sendMessage(chatId, chunk, {
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                  });
                  await new Promise(resolve => setTimeout(resolve, 500)); // Throttle
                }
              }
            } catch (error) {
              console.error(`Failed to send ${contentType} to chat ${chatId}:`, error);
            }
          }
        } catch (error) {
          console.error(`Error generating ${contentType} content:`, error);
        }
      }
    }
  }
}

async function handleMessage(bot, message) {
  const chatId = message.chat.id;
  const text = message.text;
  const userName = message.from?.username || message.from?.first_name || null;
  
  // Register chat for automated content if not already tracked
  if (global.contentScheduler) {
    global.contentScheduler.addChat(chatId);
  } else {
    global.contentScheduler = new CommunityContentScheduler(bot);
    global.contentScheduler.addChat(chatId);
    global.contentScheduler.start();
  }

  try {
    if (!text) {
      await bot.sendMessage(chatId, '🤖 I can only process text messages. Please send me a message with text.', {
        parse_mode: 'MarkdownV2'
      });
      return;
    }

    // Track user activity
    const userId = message.from?.id;
    if (userId) {
      if (!userActivity.has(userId)) {
        userActivity.set(userId, {
          messageCount: 0,
          lastActive: Date.now(),
          topics: new Set(),
          username: userName
        });
      }
      
      const userStats = userActivity.get(userId);
      userStats.messageCount += 1;
      userStats.lastActive = Date.now();
      
      // Extract potential topics from message
      const potentialTopics = text.toLowerCase()
        .match(/\b(crispr|gene|dna|bio|synth|trans|human|enhance|hack|science|tech)\w*\b/g) || [];
      potentialTopics.forEach(topic => userStats.topics.add(topic));
    }

    // Send typing indicator
    await bot.sendChatAction(chatId, 'typing');

    // Get conversation context
    const context = messageContext.get(chatId) || [];
    
    // Determine message type and length preference
    const type = text.toLowerCase().includes('technical') ? 'technical' :
                (text.toLowerCase().includes('detail') || text.toLowerCase().includes('comprehensive') || text.toLowerCase().includes('words')) ? 'detailed' :
                'general';
                
    // Determine response length dynamically
    let lengthPreference = 'auto';
    if (text.toLowerCase().includes('in detail') || text.toLowerCase().includes('comprehensive') || text.includes('explain thoroughly')) {
      lengthPreference = 'detailed';
    } else if (text.toLowerCase().includes('briefly') || text.toLowerCase().includes('quick')) {
      lengthPreference = 'brief';
    }

    // Command handling for community content generation
    if (text.startsWith('/')) {
      const command = text.split(' ')[0].substring(1).toLowerCase();
      
      if (['meme', 'discussion', 'news', 'poll', 'quiz', 'challenge'].includes(command)) {
        // Generate community content
        await bot.sendChatAction(chatId, 'typing');
        const content = await generateCommunityContent(command);
        
        // Special handling for polls
        if (command === 'poll' && bot.telegram) {
          // Extract poll options from content
          const pollMatch = content.match(/A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)(\s|$)/s);
          if (pollMatch) {
            const question = content.split('?')[0] + '?';
            const options = [pollMatch[1].trim(), pollMatch[2].trim(), pollMatch[3].trim(), pollMatch[4].trim()];
            
            // Send actual poll through Telegram
            await bot.telegram.sendPoll(chatId, question, options, { is_anonymous: false });
            return;
          }
        }
        
        // For other content types or if poll extraction failed
        const chunks = splitMessage(content, 4000);
        for (let chunk of chunks) {
          if (chunk.trim().length > 0) {
            await bot.sendMessage(chatId, chunk, {
              parse_mode: 'Markdown',
              disable_web_page_preview: true
            });
          }
        }
        return;
      }
    }

    // Check if it's a multi-part question
    const questions = text.split(/"\n"/).map(q => q.replace(/^"|"$/g, '').trim()).filter(q => q);
    
    if (questions.length > 1) {
      // Send acknowledgment with emoji
      await bot.sendMessage(chatId, "🧪 *Processing Multiple Questions*\n\nI'll answer each of your questions in sequence. Starting with your first question now...", {
        parse_mode: 'Markdown'
      });
      
      // Handle each question sequentially
      for (let i = 0; i < questions.length; i++) {
        const questionText = questions[i];
        
        // Send typing indicator for each question
        await bot.sendChatAction(chatId, 'typing');
        
        // Generate response for this specific question
        const response = await generateAIResponse(questionText, context, type, userName, lengthPreference);
        
        // Update context with this question
        context.push(questionText);
        if (context.length > 10) context.shift(); // Keep last 10 messages
        messageContext.set(chatId, context);
        
        // Format message header
        const questionNumber = `🔬 *Question ${i+1}/${questions.length}*`;
        const questionPreview = questionText.substring(0, 50) + (questionText.length > 50 ? '...' : '');
        const questionHeader = `${questionNumber}\n📝 ${questionPreview}\n\n`;
        
        // Split and send response
        const chunks = splitMessage(questionHeader + response, 4000);
        for (let j = 0; j < chunks.length; j++) {
          const chunk = chunks[j];
          if (chunk.trim().length > 0) {
            // Add continuation marker for multi-part responses
            const continuationMarker = chunks.length > 1 && j < chunks.length - 1 ? 
              '\n\n⏩ *Continued in next message...*' : '';
              
            await bot.sendMessage(chatId, chunk + continuationMarker, {
              parse_mode: 'Markdown',
              disable_web_page_preview: true
            });
          }
        }
        
        // Brief pause between responses
        if (i < questions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          await bot.sendChatAction(chatId, 'typing');
          await bot.sendMessage(chatId, `✅ *Question ${i+1} completed*\n\// Moving on to the next question*\n\nProcessing your next question now...`, {
  parse_mode: 'Markdown'
});
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      // Final completion message
      await bot.sendMessage(chatId, "✅ *All questions answered*\n\nI've responded to all your questions. Feel free to ask if you need any clarification or have additional questions about BIO/ACC topics!", {
        parse_mode: 'Markdown'
      });
      
      return;
    }

    // Normal single-question flow
    // Generate AI response with enhanced context
    const response = await generateAIResponse(text, context, type, userName, lengthPreference);
    
    // Update context
    context.push(text);
    if (context.length > 10) context.shift(); // Keep last 10 messages
    messageContext.set(chatId, context);

    // Split long messages if needed
    const MAX_MESSAGE_LENGTH = 4000; // Telegram has a 4096 character limit
    
    if (response.length <= MAX_MESSAGE_LENGTH) {
      await bot.sendMessage(chatId, response, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
    } else {
      // Split message into parts
      const chunks = splitMessage(response, MAX_MESSAGE_LENGTH);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (chunk.trim().length > 0) {
          // Add continuation marker for multi-part responses
          const continuationMarker = chunks.length > 1 && i < chunks.length - 1 ? 
            '\n\n⏩ *Continued in next message...*' : '';
            
          await bot.sendMessage(chatId, chunk + continuationMarker, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true
          });
          
          // Brief pause between chunks to avoid rate limiting
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await bot.sendChatAction(chatId, 'typing');
          }
        }
      }
    }
    
    // Personalized follow-up for regular users
    if (userId && userActivity.get(userId)?.messageCount >= 3) {
      const userStats = userActivity.get(userId);
      const hoursSinceLastActive = (Date.now() - userStats.lastActive) / (1000 * 60 * 60);
      
      // For returning users after a significant break
      if (hoursSinceLastActive > 24) {
        // Prepare a personalized follow-up question based on their history
        await new Promise(resolve => setTimeout(resolve, 5000));
        await bot.sendChatAction(chatId, 'typing');
        
        const followUpPrompt = `Based on previous conversations with user @${userStats.username || 'this user'}, they've shown interest in ${Array.from(userStats.topics).slice(0,3).join(', ')}. Generate a brief, friendly follow-up question (1-2 sentences) that builds on this conversation about ${text}. Make it conversational, not like a generic FAQ.`;
        
        try {
          const followUp = await generateAIResponse(followUpPrompt, [], 'community', null, 'brief');
          await bot.sendMessage(chatId, followUp, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true
          });
        } catch (error) {
          console.error('Error generating follow-up:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error handling message:', error);
    await bot.sendMessage(chatId, "🧬 *BIO/ACC Bot*\n\nI apologize, but I encountered an error processing your request. Please try again or rephrase your question.", {
      parse_mode: 'Markdown'
    });
  }
}

// Helper function to split messages that exceed Telegram's character limit
function splitMessage(text, maxLength) {
  if (!text) return [''];
  if (text.length <= maxLength) return [text];
  
  const chunks = [];
  let currentChunk = '';
  
  // Split preferably at paragraph breaks
  const paragraphs = text.split('\n\n');
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the limit, store the current chunk and start a new one
    if (currentChunk.length + paragraph.length + 2 > maxLength) {
      // If current chunk is already too long, we need to split the paragraph
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      
      // If the paragraph itself is longer than maxLength, split it
      if (paragraph.length > maxLength) {
        // Try to split at sentence boundaries
        const sentences = paragraph.split(/(?<=\.|\?|\!)\s+/);
        let sentenceChunk = '';
        
        for (const sentence of sentences) {
          if (sentenceChunk.length + sentence.length > maxLength) {
            if (sentenceChunk) {
              chunks.push(sentenceChunk);
            }
            
            // If a single sentence is too long, split arbitrarily but try to avoid breaking Markdown
            if (sentence.length > maxLength) {
              let remaining = sentence;
              while (remaining.length > 0) {
                // Find a safe place to split (not in the middle of Markdown)
                let splitPoint = maxLength;
                
                // Try to avoid splitting inside markdown
                while (splitPoint > maxLength - 100 && 
                      (remaining.substring(splitPoint-1, splitPoint+1).match(/\*\*|\*|__|\[|\]\(|`/) || 
                       remaining.substring(splitPoint, splitPoint+1).match(/\*|_|\]|\)/))) {
                  splitPoint--;
                }
                
                // If we couldn't find a good split point, just use the max
                if (splitPoint <= maxLength - 100) {
                  splitPoint = maxLength;
                }
                
                chunks.push(remaining.substring(0, splitPoint));
                remaining = remaining.substring(splitPoint);
              }
            } else {
              chunks.push(sentence);
            }
            sentenceChunk = '';
          } else {
            sentenceChunk += sentence;
          }
        }
        
        if (sentenceChunk) {
          currentChunk = sentenceChunk;
        }
      } else {
        chunks.push(paragraph);
      }
    } else {
      // Add paragraph separator if not the first paragraph in this chunk
      if (currentChunk.length > 0) {
        currentChunk += '\n\n';
      }
      currentChunk += paragraph;
    }
  }
  
  // Don't forget the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Initialize the bot with enhanced community features
module.exports = {
  handleMessage,
  generateAIResponse,
  CommunityContentScheduler,
  generateCommunityContent
};