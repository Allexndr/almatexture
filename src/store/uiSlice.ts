import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  theme: 'light' | 'dark';
  modals: {
    registration: boolean;
    login: boolean;
    productDetails: boolean;
    currentProductId: string | null;
  };
  notifications: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  language: 'ru' | 'en' | 'kz';
  sidebarOpen: boolean;
}

const initialState: UIState = {
  theme: 'light',
  modals: {
    registration: false,
    login: false,
    productDetails: false,
    currentProductId: null
  },
  notifications: {
    show: false,
    message: '',
    type: 'info'
  },
  language: 'ru',
  sidebarOpen: false
};

// Загружаем тему из localStorage при инициализации
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    initialState.theme = storedTheme;
  }
  
  const storedLanguage = localStorage.getItem('language');
  if (storedLanguage === 'ru' || storedLanguage === 'en' || storedLanguage === 'kz') {
    initialState.language = storedLanguage;
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      if (action.payload in state.modals) {
        // @ts-ignore - динамический доступ к ключам
        state.modals[action.payload] = true;
      }
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      if (action.payload in state.modals) {
        // @ts-ignore - динамический доступ к ключам
        state.modals[action.payload] = false;
      }
    },
    setCurrentProductId: (state, action: PayloadAction<string | null>) => {
      state.modals.currentProductId = action.payload;
    },
    showNotification: (state, action: PayloadAction<{ message: string, type: UIState['notifications']['type'] }>) => {
      state.notifications.show = true;
      state.notifications.message = action.payload.message;
      state.notifications.type = action.payload.type;
    },
    hideNotification: (state) => {
      state.notifications.show = false;
    },
    setLanguage: (state, action: PayloadAction<UIState['language']>) => {
      state.language = action.payload;
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    }
  }
});

export const {
  toggleTheme,
  setTheme,
  openModal,
  closeModal,
  setCurrentProductId,
  showNotification,
  hideNotification,
  setLanguage,
  toggleSidebar
} = uiSlice.actions;

export default uiSlice.reducer; 