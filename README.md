# BIO/ACC Telegram Bot

A Telegram bot for the BIO/ACC community that provides information, facilitates discussions, and manages community engagement.

## Features

- Community polls and quizzes
- BIO/ACC information and explanations
- Daily updates and news
- Meme explanations
- User account management
- Automated content scheduling

## Requirements

- Node.js >= 16.0.0
- MongoDB database
- Telegram Bot Token
- Together AI API Key

## Environment Variables

Create a `.env` file with:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
MONGODB_URI=your_mongodb_uri
TOGETHER_API_KEY=your_together_ai_key
WEBHOOK_URL=your_webhook_url
PORT=3000
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Start the bot:
   ```bash
   npm start
   ```

## Deployment

1. Push code to your hosting platform (e.g., Heroku, DigitalOcean)
2. Set environment variables in your hosting platform
3. Ensure webhook URL is configured correctly
4. Deploy and start the application

## Commands

- `/start` - Start the bot
- `/help` - Show help message
- `/poll` - Create a community poll
- `/quiz` - Start a BIO/ACC quiz
- `/meme` - Get a BIO/ACC meme
- `/news` - Get latest updates
- `/challenge` - Start a community challenge
- `/schedule` - Set up automated content 