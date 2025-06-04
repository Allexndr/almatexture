import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    city?: string;
    region?: string;
    country?: string;
    address?: string;
    phone?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

// Проверяем наличие данных пользователя в localStorage при инициализации
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  const storedAuth = localStorage.getItem('isAuthenticated');
  
  if (storedUser && storedAuth === 'true') {
    try {
      initialState.user = JSON.parse(storedUser);
      initialState.isAuthenticated = true;
    } catch (error) {
      console.error('Ошибка при чтении данных пользователя из localStorage:', error);
    }
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('isAuthenticated', 'true');
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      
      // Удаляем из localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserState['user']>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Обновляем в localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } = userSlice.actions;

export default userSlice.reducer; 