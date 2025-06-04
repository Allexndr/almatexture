// Script to test the products API endpoint
const fetch = require('node-fetch');

// Функция для тестирования API
async function testApi() {
  console.log('--- Тестирование API добавления товара ---');
  
  const testProduct = {
    title: "Тестовый товар",
    description: "Описание тестового товара",
    price: 1000,
    category: "tshirt",
    stock: 10,
    hasColorOptions: true,
    hasSizeOptions: true,
    colors: ["Красный", "Синий"],
    sizes: ["S", "M", "L"]
  };
  
  try {
    console.log('Отправка запроса на добавление товара...');
    
    const response = await fetch('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProduct),
    });
    
    console.log('Статус ответа:', response.status);
    
    // Попытка получить тело ответа
    const responseText = await response.text();
    console.log('Тело ответа (текст):', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('Ответ в формате JSON:', data);
    } catch (jsonError) {
      console.error('Не удалось распарсить JSON:', jsonError);
    }
    
    if (response.ok) {
      console.log('✅ Успешно добавлен тестовый товар!');
    } else {
      console.error('❌ Ошибка при добавлении товара!');
    }
  } catch (error) {
    console.error('Ошибка при запросе к API:', error);
  }
}

// Запуск теста
testApi(); 