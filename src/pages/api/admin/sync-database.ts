import type { NextApiRequest, NextApiResponse } from 'next';
import { execSync } from 'child_process';
import * as path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Пасхалка: секретный режим синхронизации
  if (req.body.secretMode === 'barys') {
    return res.status(200).json({ 
      success: true, 
      message: 'Секретный режим барыса активирован!',
      secret: 'Аккуратнее с базой данных, хотя любую проблему можно решить за чашкой кумыса в горах Алатау!',
      joke: 'Знаете, почему программисты в Алматы лучшие? Потому что у нас самый высокий уровень... кода! 🏔️'
    });
  }

  try {
    // Запускаем синхронизацию базы данных
    const projectRoot = path.resolve(process.cwd());
    const output = execSync('npm run sync-db', { cwd: projectRoot }).toString();
    
    // Возвращаем результат синхронизации
    return res.status(200).json({ 
      success: true, 
      message: 'Database synchronization completed successfully',
      output 
    });
  } catch (error) {
    console.error('Error during database synchronization:', error);
    return res.status(500).json({ 
      error: 'An error occurred during database synchronization',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 