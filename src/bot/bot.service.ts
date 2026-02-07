import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class BotService implements OnModuleInit {
  bot: Telegraf;

  onModuleInit() {
    const token = process.env.BOT_TOKEN;
    if (!token) {
      throw new Error('BOT_TOKEN is not defined in environment variables');
    }
    this.bot = new Telegraf(token);
    this.bot.launch();
    console.log('🤖 Telegram bot started');
  }

  getBot() {
    return this.bot;
  }
}
