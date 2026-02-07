import { Injectable, OnModuleInit } from '@nestjs/common';
import { BotService } from './bot.service';
import { ExerciseService } from '../exercise/exercise.service';
import { TargetService } from '../target/target.service';

@Injectable()
export class BotUpdate implements OnModuleInit {
  constructor(
    private readonly botService: BotService,
    private readonly exerciseService: ExerciseService,
    private readonly targetService: TargetService,
  ) {}

  onModuleInit() {
    const bot = this.botService.getBot();

    // کیبورد اصلی
    const mainKeyboard = {
      keyboard: [
        [{ text: '🏋️ جستجوی حرکت' }, { text: '🎯 عضلات هدف' }],
        [{ text: '❓ راهنما' }, { text: '🚪 خروج' }],
      ],
      resize_keyboard: true,
    };

    // دستور start
    bot.start((ctx) => {
      const firstName = ctx.from.first_name || 'کاربر';
      ctx.reply(
        `سلام ${firstName}! 👋\nبه ربات فیتنس خوش اومدی 💪\n\nمن می‌تونم بهت کمک کنم تا حرکات ورزشی رو یاد بگیری.`,
        {
          reply_markup: mainKeyboard,
        },
      );
    });

    // هندل کردن دکمه راهنما
    bot.hears('❓ راهنما', (ctx) => {
      ctx.reply(
        `📚 *راهنمای استفاده*\n\n` +
          `🏋️ برای جستجوی حرکت ورزشی:\n` +
          `از دکمه "جستجوی حرکت" استفاده کن یا\n` +
          `/exercise [نام حرکت]\n\n` +
          `*مثال‌ها:*\n` +
          `• /exercise push up\n` +
          `• /exercise squat\n` +
          `• /exercise bench press`,
        { parse_mode: 'Markdown' },
      );
    });

    // هندل کردن دکمه خروج
    bot.hears('🚪 خروج', (ctx) => {
      ctx.reply('خداحافظ! 👋\nهر وقت خواستی برگرد: /start', {
        reply_markup: { remove_keyboard: true },
      });
    });

    // هندل کردن دکمه جستجوی حرکت
    bot.hears('🏋️ جستجوی حرکت', (ctx) => {
      ctx.reply(
        'اسم حرکت ورزشی رو بنویس:\n\nمثال‌ها:\n• push up\n• squat\n• bench press',
      );
    });

    // هندل کردن دکمه عضلات هدف
    bot.hears('🎯 عضلات هدف', async (ctx) => {
      try {
        await ctx.reply('در حال دریافت لیست عضلات... ⏳');
        const targets = await this.targetService.getTargetList();

        // ساخت inline keyboard با 2 دکمه در هر ردیف
        const keyboard: any[] = [];
        for (let i = 0; i < targets.length; i += 2) {
          const row = [
            { text: targets[i], callback_data: `target_${targets[i]}` },
          ];
          if (i + 1 < targets.length) {
            row.push({ text: targets[i + 1], callback_data: `target_${targets[i + 1]}` });
          }
          keyboard.push(row);
        }

        ctx.reply('یک عضله انتخاب کن: 💪', {
          reply_markup: {
            inline_keyboard: keyboard,
          },
        });
      } catch (e) {
        console.error('Error fetching targets:', e);
        ctx.reply('خطا در دریافت لیست عضلات 😐');
      }
    });

    // هندل کردن انتخاب target از inline keyboard
    bot.action(/^target_(.+)$/, async (ctx) => {
      const target = ctx.match[1];
      await ctx.answerCbQuery();

      try {
        await ctx.reply(`در حال جستجوی حرکات برای ${target}... ⏳`);
        const exercises = await this.targetService.getExercisesByTarget(target);

        if (!exercises || exercises.length === 0) {
          return ctx.reply('حرکتی برای این عضله پیدا نشد 😕');
        }

        // ساخت inline keyboard برای حرکات (هر حرکت یک دکمه)
        const keyboard: any[] = [];
        exercises.forEach((ex: any) => {
          keyboard.push([
            { text: ex.name, callback_data: `exercise_${ex.id}` },
          ]);
        });

        await ctx.reply(`🎯 *حرکات برای ${target}:*\n\nیک حرکت انتخاب کن:`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: keyboard,
          },
        });
      } catch (e) {
        console.error('Error fetching exercises by target:', e);
        ctx.reply('خطا در دریافت حرکات 😐');
      }
    });

    // هندل کردن انتخاب exercise از inline keyboard
    bot.action(/^exercise_(.+)$/, async (ctx) => {
      const exerciseId = ctx.match[1];
      await ctx.answerCbQuery();

      try {
        await ctx.reply('در حال دریافت اطلاعات... ⏳');
        
        // دریافت اطلاعات حرکت با ID از طریق API
        const apiKey = process.env.RAPID_API_KEY;
        const axios = require('axios');
        
        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`,
          {
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            },
          },
        );

        const res = response.data;

        if (!res) {
          return ctx.reply('حرکت پیدا نشد 😕');
        }

        const message = `
🏋️ *${res.name}*

🎯 عضله هدف: ${res.target}
💪 قسمت بدن: ${res.bodyPart}
🛠 تجهیزات: ${res.equipment}
⚡️ سطح: ${res.difficulty || 'متوسط'}
🔥 عضلات دوم: ${res.secondaryMuscles?.join(', ') || 'ندارد'}

📝 *دستورالعمل:*
${res.instructions?.map((inst: string, i: number) => `${i + 1}. ${inst}`).join('\n') || 'ندارد'}
`;

        await ctx.reply(message, { parse_mode: 'Markdown' });
      } catch (e) {
        console.error('Error fetching exercise:', e);
        ctx.reply('خطا در دریافت اطلاعات 😐');
      }
    });

    // دستور help
    bot.command('help', (ctx) => {
      ctx.reply(
        `📚 *راهنمای استفاده*\n\n` +
          `🏋️ برای جستجوی حرکت ورزشی:\n` +
          `از دکمه "جستجوی حرکت" استفاده کن یا\n` +
          `/exercise [نام حرکت]\n\n` +
          `*مثال‌ها:*\n` +
          `• /exercise push up\n` +
          `• /exercise squat\n` +
          `• /exercise bench press`,
        { parse_mode: 'Markdown' },
      );
    });

    bot.command('exercise', async (ctx) => {
      const name = ctx.message.text.replace('/exercise', '').trim();
      if (!name) {
        return ctx.reply(
          'اسم حرکت رو بنویس 💪\n\nمثال‌ها:\n• /exercise push up\n• /exercise squat\n• /exercise bench press',
        );
      }

      try {
        await ctx.reply('در حال جستجو... ⏳');
        const exercises = await this.exerciseService.getExercises(name);

        if (!exercises || exercises.length === 0) {
          return ctx.reply(
            '❌ حرکتی پیدا نشد\n\nنکته: اسم دقیق حرکت رو بنویس\nمثلاً: "push up" یا "squat"',
          );
        }

        // اگه فقط یک نتیجه بود، مستقیم نشون بده
        if (exercises.length === 1) {
          const ex = exercises[0];
          const message = `
🏋️ *${ex.name}*

🎯 عضله هدف: ${ex.target}
💪 قسمت بدن: ${ex.bodyPart}
🛠 تجهیزات: ${ex.equipment}
⚡️ سطح: ${ex.difficulty || 'متوسط'}
🔥 عضلات دوم: ${ex.secondaryMuscles?.join(', ') || 'ندارد'}

📝 *دستورالعمل:*
${ex.instructions?.map((inst: string, i: number) => `${i + 1}. ${inst}`).join('\n') || 'ندارد'}
`;
          return ctx.reply(message, { parse_mode: 'Markdown' });
        }

        // اگه چند تا نتیجه بود، به صورت inline keyboard نشون بده
        const keyboard: any[] = [];
        exercises.forEach((ex: any) => {
          keyboard.push([
            { text: ex.name, callback_data: `exercise_${ex.id}` },
          ]);
        });

        await ctx.reply(
          `🔍 *${exercises.length} حرکت پیدا شد:*\n\nیکی رو انتخاب کن:`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: keyboard,
            },
          },
        );
      } catch (e) {
        console.error('Bot error:', e);
        ctx.reply(
          '❌ خطا در دریافت اطلاعات\n\nممکنه API مشکل داشته باشه.\nلطفاً دوباره تلاش کن.',
        );
      }
    });

    // هندل کردن پیام‌های معمولی (برای جستجوی حرکت بدون /exercise)
    bot.on('text', async (ctx) => {
      const text = ctx.message.text;
      
      // اگه دکمه یا دستور بود، نادیده بگیر
      if (text.startsWith('/') || text.startsWith('🏋️') || text.startsWith('❓') || text.startsWith('🚪') || text.startsWith('🎯')) {
        return;
      }

      // در غیر این صورت، به عنوان جستجوی حرکت در نظر بگیر
      try {
        await ctx.reply('در حال جستجو... ⏳');
        const exercises = await this.exerciseService.getExercises(text);

        if (!exercises || exercises.length === 0) {
          return ctx.reply(
            '❌ حرکتی پیدا نشد\n\nنکته: اسم دقیق حرکت رو بنویس\nمثلاً: "push up" یا "squat"',
          );
        }

        // اگه فقط یک نتیجه بود، مستقیم نشون بده
        if (exercises.length === 1) {
          const ex = exercises[0];
          const message = `
🏋️ *${ex.name}*

🎯 عضله هدف: ${ex.target}
💪 قسمت بدن: ${ex.bodyPart}
🛠 تجهیزات: ${ex.equipment}
⚡️ سطح: ${ex.difficulty || 'متوسط'}
🔥 عضلات دوم: ${ex.secondaryMuscles?.join(', ') || 'ندارد'}

📝 *دستورالعمل:*
${ex.instructions?.map((inst: string, i: number) => `${i + 1}. ${inst}`).join('\n') || 'ندارد'}
`;
          return ctx.reply(message, { parse_mode: 'Markdown' });
        }

        // اگه چند تا نتیجه بود، به صورت inline keyboard نشون بده
        const keyboard: any[] = [];
        exercises.forEach((ex: any) => {
          keyboard.push([
            { text: ex.name, callback_data: `exercise_${ex.id}` },
          ]);
        });

        await ctx.reply(
          `🔍 *${exercises.length} حرکت پیدا شد:*\n\nیکی رو انتخاب کن:`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: keyboard,
            },
          },
        );
      } catch (e) {
        console.error('Bot error:', e);
        ctx.reply(
          '❌ خطا در دریافت اطلاعات\n\nممکنه API مشکل داشته باشه.\nلطفاً دوباره تلاش کن.',
        );
      }
    });
  }
}
