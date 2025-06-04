import type { NextApiRequest, NextApiResponse } from 'next';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const { name, email, subject, message }: ContactFormData = req.body;

    // Валидация данных
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Все поля обязательны для заполнения' 
      });
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Некорректный формат email адреса' 
      });
    }

    // Формируем сообщение
    const timestamp = new Date().toLocaleString('ru-RU', {
      timeZone: 'Asia/Almaty',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const formattedMessage = `=== Новое сообщение с формы контактов ===
Время: ${timestamp}
Имя: ${name}
Email: ${email}
Тема: ${subject || 'Не указана'}
Сообщение: ${message}
==========================================`;

    // Логируем в консоль
    console.log(formattedMessage);

    // Отправка в Telegram (если настроены переменные)
    const telegramBotToken = '8052457810:AAGCJIvYSAAbNvB_0vmmYRpAbWGhnE0mlWo';
    const telegramChatId = '5450018125';

    if (telegramBotToken && telegramChatId) {
      try {
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        
        const telegramMessage = `🔔 *Новое сообщение с сайта*

👤 *Имя:* ${name}
✉️ *Email:* ${email}
📝 *Тема:* ${subject || 'Не указана'}
💬 *Сообщение:*
${message}

⏰ *Время:* ${timestamp}`;

        const telegramResponse = await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramMessage,
            parse_mode: 'Markdown'
          })
        });

        if (telegramResponse.ok) {
          console.log('✅ Уведомление успешно отправлено в Telegram');
        } else {
          const errorData = await telegramResponse.json();
          console.error('❌ Ошибка отправки в Telegram:', errorData);
        }
      } catch (telegramError) {
        console.error('❌ Ошибка при отправке в Telegram:', telegramError);
      }
    } else {
      console.log('Telegram bot не настроен (отсутствуют токен или chat_id)');
    }

    // Возвращаем успешный ответ
    return res.status(200).json({ 
      success: true, 
      message: 'Сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время!' 
    });

  } catch (error) {
    console.error('Ошибка обработки контактной формы:', error);
    return res.status(500).json({ 
      error: 'Внутренняя ошибка сервера. Попробуйте позже.' 
    });
  }
} 