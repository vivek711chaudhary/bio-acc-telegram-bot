const fetch = require('node-fetch');

const TOGETHER_API_ENDPOINT = 'https://api.together.xyz/v1/completions';

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

const bioAccContent = require('./bio_acc_content');

async function generateAIResponse(prompt) {
  try {
    if (!process.env.TOGETHER_API_KEY) {
      console.log('Together AI key not found, using fallback responses');
      return getFallbackResponse(prompt);
    }

    const { desciTopics, bioAccTopics } = require('./knowledge-base');
    
    const systemPrompt = `You are BioACC Bot, focused exclusively on biotechnology, BIO/ACC principles, and scientific advancement.
    
    Your knowledge base includes:
    
    BIO/ACC Core Topics:
    ${JSON.stringify(bioAccTopics.introduction)}
    ${JSON.stringify(bioAccTopics.principles)}
    ${JSON.stringify(bioAccTopics.technologies)}
    
    DeSci Topics:
    ${JSON.stringify(desciTopics.introduction)}
    ${JSON.stringify(desciTopics.benefits)}
    ${JSON.stringify(desciTopics.projects)}
    
    Guidelines:
    1. Only answer questions related to BIO/ACC, DeSci, biotechnology, or scientific advancement
    2. If a question is outside these topics, redirect to relevant scientific aspects
    3. Use simple text formatting without markdown
    4. Keep responses clear and focused on scientific concepts
    5. Include specific examples from the knowledge base
    6. If unsure, stick to the core principles defined in the knowledge base`;

    const response = await fetch(TOGETHER_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: `${systemPrompt}\n\nUser: ${prompt}\n\nAssistant: Let me provide information based on our BIO/ACC and DeSci knowledge base.\n\n`,
        max_tokens: 500,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.7,
        repetition_penalty: 1.1,
        stop: ['User:', 'Human:', '<human>:', '<user>:']
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log

    // Check if the response has the expected structure
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].text) {
      console.error('Unexpected API response format:', data);
      return getFallbackResponse(prompt);
    }

    let cleanedResponse = data.choices[0].text
      .trim()
      // Convert HTML tags to Telegram-compatible formatting
      .replace(/<b>(.*?)<\/b>/g, '*$1*')
      .replace(/<i>(.*?)<\/i>/g, '_$1_')
      .replace(/<u>(.*?)<\/u>/g, '__$1__')
      .replace(/<code>(.*?)<\/code>/g, '`$1`')
      .replace(/<pre>(.*?)<\/pre>/g, '```$1```')
      // Remove any remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Replace complex bullets with simple dashes
      .replace(/[•●]/g, '- ')
      // Ensure proper spacing after punctuation
      .replace(/([.!?])\s*/g, '$1 ')
      // Add proper line breaks for lists
      .replace(/(?:^|\n)[-•●]\s*/g, '\n• ')
      // Normalize multiple newlines but keep paragraph structure
      .replace(/\n{3,}/g, '\n\n')
      // Format key terms with bold
      .replace(/\b(BIO\/ACC|DeSci|CRISPR|mRNA)\b(?![*])/g, '*$1*')
      // Keep essential emojis and add them to key sections
      .replace(/🧬|🔬|🧪|🧫|🦠|🤖/, '')
      // Add section emojis if they don't exist
      .replace(/(?:^|\n\n)Key Points:/g, '\n\n🔑 Key Points:')
      .replace(/(?:^|\n\n)Benefits:/g, '\n\n✨ Benefits:')
      .replace(/(?:^|\n\n)Projects:/g, '\n\n🚀 Projects:')
      .replace(/(?:^|\n\n)Technologies:/g, '\n\n⚡ Technologies:')
      .replace(/(?:^|\n\n)Applications:/g, '\n\n🎯 Applications:')
      // Clean up any double spaces
      .replace(/\s{2,}/g, ' ')
      .trim();

    // If response doesn't seem to be about BIO/ACC or DeSci, add a redirect
    if (!cleanedResponse.toLowerCase().includes('bio') && 
        !cleanedResponse.toLowerCase().includes('science') && 
        !cleanedResponse.toLowerCase().includes('tech')) {
      cleanedResponse = `🧬 Let me address this from a BIO/ACC and scientific perspective:\n\n${cleanedResponse}`;
    }

    // Add a footer for longer responses
    if (cleanedResponse.length > 500) {
      cleanedResponse += '\n\n💡 Want to learn more? Feel free to ask specific questions about any of these topics!';
    }

    return cleanedResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return getFallbackResponse(prompt);
  }
}

function getFallbackResponse(prompt) {
  // Common static responses for frequently asked questions
  const fallbackResponses = {
    desci: "DeSci (Decentralized Science) is a movement to make scientific research and funding more accessible and transparent. It uses blockchain and other decentralized technologies to enable direct community funding, open access to research, and collaborative scientific work outside traditional institutions.",
    "bio acc": "BIO/ACC (Biological Accelerationism) is a movement focused on accelerating biological and technological evolution. It emphasizes democratizing biotechnology, ethical enhancement, and aligning with natural systems while promoting open-source knowledge and efficient supply chains.",
    crispr: "CRISPR is a revolutionary gene-editing technology that allows precise modifications to DNA. It's like a genetic scissors that can cut, edit, or insert specific genes, with applications in medicine, agriculture, and biotechnology.",
    default: "I specialize in BIO/ACC, DeSci, and biotechnology topics. I aim to provide accurate information about scientific advancement and biological technologies. What specific aspect would you like to learn more about?"
  };

  // Check for keywords in the prompt
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('desci')) return fallbackResponses.desci;
  if (lowerPrompt.includes('bio acc') || lowerPrompt.includes('bioacc')) return fallbackResponses["bio acc"];
  if (lowerPrompt.includes('crispr')) return fallbackResponses.crispr;
  return fallbackResponses.default;
}

function cleanMarkdown(text) {
  // First, escape special characters
  let cleaned = text.replace(/[_*\[\]()~`>#+=|{}.!-]/g, '\\$&');
  
  // Replace common problematic patterns
  cleaned = cleaned.replace(/\\{2,}/g, '\\'); // Remove multiple escapes
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Normalize multiple newlines
  cleaned = cleaned.replace(/^\s+|\s+$/g, ''); // Trim whitespace
  
  return cleaned;
}

async function generateQuizPrompt() {
  const topic = bioAccContent.getRandomTopic();
  const principle = bioAccContent.principles[Math.floor(Math.random() * bioAccContent.principles.length)];
  
  return `Generate a challenging multiple choice question about ${topic} or ${principle.title}. Focus on testing understanding of BIO/ACC concepts.
Format exactly as:
Question: [question]
A) [option]
B) [option]
C) [option]
D) [option]
Correct: [A/B/C/D]
Explanation: [explanation]`;
}

async function generateInsightPrompt() {
  const topic = bioAccContent.getRandomTopic();
  const principle = bioAccContent.principles[Math.floor(Math.random() * bioAccContent.principles.length)];
  
  return `Generate a brief insight (max 150 words) about ${topic}, focusing on ${principle.title}. 
Keep the language clear and avoid special characters or complex formatting.
Include:
1. A key observation
2. Current developments
3. Future implications`;
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
    ]
  };

  if (contentType === 'challenge') {
    try {
      const challengePrompt = `Create an engaging BIO/ACC community challenge. The challenge should be:
1. Fun and interesting
2. Related to biotechnology, science, or BIO/ACC principles
3. Achievable within 1-7 days
4. Educational and thought-provoking
5. Safe and ethical

Format the response exactly as:
🧬 Challenge Title: [title]
⏱️ Duration: [X days]
🎯 Objective: [clear, concise objective]
📋 Requirements:
- [requirement 1]
- [requirement 2]
- [requirement 3]
🌟 Bonus Goals:
- [optional bonus goal 1]
- [optional bonus goal 2]
🏆 Success Criteria: [how to know when completed]
💡 Tips: [helpful tips for completion]

Make it creative and unique!`;

      const response = await generateAIResponse(challengePrompt);
      return response;
    } catch (error) {
      console.error('Error generating challenge:', error);
      // Fallback to a basic challenge if AI generation fails
      return `🧬 DIY Science Challenge\n\n⏱️ Duration: 3 days\n\n🎯 Document and share an interesting scientific observation from your daily life.\n\n📋 Requirements:\n- Make a hypothesis about something you observe\n- Design a simple experiment\n- Document your findings\n- Share with the community\n\n🌟 Bonus: Include photos or diagrams\n\n🏆 Success: Complete documentation of your mini-experiment`;
    }
  }
  
  // Pick a random prompt from other categories
  const prompts = topics[contentType] || topics['discussion'];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  
  // Generate content based on the prompt
  return await generateAIResponse(randomPrompt);
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
        const response = await generateAIResponse(questionText);
        
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
    const response = await generateAIResponse(text);
    
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
          const followUp = await generateAIResponse(followUpPrompt);
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
  generateCommunityContent,
  generateQuizPrompt,
  generateInsightPrompt,
  cleanMarkdown
};