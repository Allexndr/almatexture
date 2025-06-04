import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        gallery: 'Gallery',
        districts: 'Districts',
        shop: 'Shop',
        about: 'About',
        contacts: 'Contacts'
      },
      common: {
        loading: 'Loading...',
        error: 'Error',
        retry: 'Try Again'
      },
      shop: {
        title: 'AlmaTexture Shop',
        description: 'Discover a collection of unique items that embody the textures of Almaty in everyday things. Each item carries a piece of the city and its history.',
        errorTitle: 'Error loading products:',
        errorStatus: 'HTTP error! Status:',
        uniqueItems: 'Unique items with city spirit',
        uniqueDescription: 'Each item is handcrafted and carries the character of a specific district or location in Almaty. By choosing our products, you support local art and cultural projects.'
      }
    }
  },
  ru: {
    translation: {
      nav: {
        gallery: 'Галерея',
        districts: 'Районы',
        shop: 'Магазин',
        about: 'О проекте',
        contacts: 'Контакты'
      },
      common: {
        loading: 'Загрузка...',
        error: 'Ошибка',
        retry: 'Попробовать снова'
      },
      shop: {
        title: 'Магазин AlmaTexture',
        description: 'Откройте для себя коллекцию уникальных предметов, которые воплощают текстуры Алматы в повседневных вещах. Каждый предмет хранит частичку города и его истории.',
        errorTitle: 'Ошибка загрузки товаров:',
        errorStatus: 'HTTP ошибка! Статус:',
        uniqueItems: 'Уникальные предметы с духом города',
        uniqueDescription: 'Каждое изделие создано вручную и несет в себе характер определенного района или локации Алматы. Выбирая нашу продукцию, вы поддерживаете локальное искусство и культурные проекты.'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // язык по умолчанию
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 