# 🏋️ Fitness Bot

A Telegram bot built with NestJS that helps users discover and learn about various exercises. The bot provides detailed information about exercises, including target muscles, equipment needed, difficulty levels, and step-by-step instructions.

## ✨ Features

- 🔍 **Exercise Search**: Search for exercises by name with intelligent filtering
- 🎯 **Target Muscle Browser**: Browse exercises by target muscle groups
- 📋 **Multiple Results**: When multiple exercises match your search, choose from an inline keyboard
- 📝 **Detailed Information**: Get comprehensive details including:
  - Target muscle groups
  - Body part worked
  - Required equipment
  - Difficulty level
  - Secondary muscles engaged
  - Step-by-step instructions
- ⌨️ **User-Friendly Interface**: Reply keyboard for easy navigation
- 🌐 **Persian Language Support**: Full support for Persian/Farsi language

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- RapidAPI Key for ExerciseDB API

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fitness-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
BOT_TOKEN=your_telegram_bot_token
RAPID_API_KEY=your_rapidapi_key
PORT=3000
```

4. Start the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## 🎮 Bot Commands

- `/start` - Start the bot and display the main keyboard
- `/exercise [name]` - Search for exercises by name
- `/help` - Display help information

## 🎯 Main Features

### 1. Exercise Search
Users can search for exercises in two ways:
- Using the command: `/exercise push up`
- Simply typing the exercise name: `push up`

If multiple exercises match the search, the bot displays them as clickable buttons.

### 2. Target Muscle Browser
Click the "🎯 عضلات هدف" (Target Muscles) button to:
1. View all available muscle groups
2. Select a muscle group
3. Browse exercises targeting that muscle
4. View detailed information about any exercise

### 3. Keyboard Navigation
The bot provides an easy-to-use keyboard with options:
- 🏋️ Search Exercise
- 🎯 Target Muscles
- ❓ Help
- 🚪 Exit

## 🏗️ Project Structure

```
src/
├── bot/
│   ├── bot.module.ts       # Bot module configuration
│   ├── bot.service.ts      # Telegram bot initialization
│   └── bot.update.ts       # Bot command handlers
├── exercise/
│   ├── exercise.module.ts  # Exercise module
│   ├── exercise.service.ts # Exercise business logic
│   └── exercise.client.ts  # ExerciseDB API client
├── target/
│   ├── target.module.ts    # Target muscle module
│   ├── target.service.ts   # Target muscle business logic
│   └── target.client.ts    # Target muscle API client
└── app.module.ts           # Main application module
```

## 🔧 Technologies Used

- **NestJS** - Progressive Node.js framework
- **Telegraf** - Modern Telegram Bot API framework
- **Axios** - HTTP client for API requests
- **TypeScript** - Type-safe JavaScript
- **ExerciseDB API** - Exercise database via RapidAPI

## 📡 API Integration

This bot uses the [ExerciseDB API](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb) from RapidAPI, which provides:
- 1300+ exercises with detailed information
- Target muscle filtering
- Exercise search by name
- Comprehensive exercise data

## 🛠️ Development

### Running in Development Mode
```bash
npm run start:dev
```

### Building for Production
```bash
npm run build
npm run start:prod
```

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOT_TOKEN` | Telegram Bot Token from BotFather | Yes |
| `RAPID_API_KEY` | RapidAPI key for ExerciseDB | Yes |
| `PORT` | Application port (default: 3000) | No |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The framework used
- [Telegraf](https://telegraf.js.org/) - Telegram Bot framework
- [ExerciseDB](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb) - Exercise database API

## 📞 Support

For support, questions, or feedback, please open an issue in the repository.
