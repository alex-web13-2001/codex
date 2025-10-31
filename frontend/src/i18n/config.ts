import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome back',
      dashboard: 'Dashboard',
      projects: 'Projects',
      archive: 'Archive'
    }
  },
  ru: {
    translation: {
      welcome: 'С возвращением',
      dashboard: 'Дэшборд',
      projects: 'Проекты',
      archive: 'Архив'
    }
  }
};

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
