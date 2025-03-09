const axios = require('axios');
require('dotenv').config();

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_API_URL = 'https://api.together.xyz/v1/completions';

/**
 * Generate a response using Together AI
 * @param {string} prompt - The user's query
 * @returns {Promise<string>} - The AI-generated response
 */
async function generateResponse(prompt) {
  try {
    const response = await axios.post(
      TOGETHER_API_URL,
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: `You are a helpful assistant specializing in decentralized science (DeSci) and biological acceleration (Bio/ACC). 
        Answer the following question in a concise, informative way:
        
        ${prompt}`,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
      },
      {
        headers: {
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating response from Together AI:', error);
    return "I'm sorry, I couldn't generate a response at the moment. Please try again later.";
  }
}

module.exports = {
  generateResponse
}; 