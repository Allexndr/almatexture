import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Texture {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  district: string;
  author?: string;
  createdAt: string;
  tags?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  colors?: string[];
  sizes?: string[];
  title?: string; // Для обратной совместимости
  image?: string; // Для обратной совместимости
  // Новые поля
  district?: string;
  texture?: string;
  clothingType?: string;
  material?: string;
  collection?: string;
  season?: string;
  printTechnique?: string;
  designStyle?: string;
  isEco?: boolean;
  isOnSale?: boolean;
  discountPrice?: number | null;
  timePeriod?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface District {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  textureCount: number;
}

interface DataState {
  textures: {
    items: Texture[];
    loading: boolean;
    error: string | null;
  };
  products: {
    items: Product[];
    loading: boolean;
    error: string | null;
  };
  districts: {
    items: District[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: DataState = {
  textures: {
    items: [],
    loading: false,
    error: null
  },
  products: {
    items: [],
    loading: false,
    error: null
  },
  districts: {
    items: [],
    loading: false,
    error: null
  }
};

// Async thunks для получения данных с сервера
export const fetchTextures = createAsyncThunk(
  'data/fetchTextures',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/textures');
      return response.data;
    } catch (error) {
      return rejectWithValue('Не удалось загрузить текстуры');
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'data/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Используем новый простой API endpoint для MongoDB
      const response = await axios.get('/api/products/simple');
      
      if (response.data.success) {
        return response.data.products;
      } else {
        throw new Error('Unsuccessful response from API');
      }
    } catch (error) {
      console.error('Failed to fetch products from API:', error);
      
      // Если API недоступен, пытаемся загрузить из JSON файла как fallback
      try {
        const jsonResponse = await axios.get('/products.json');
        
        // Проверяем, что данные имеют правильный формат
        const products = Array.isArray(jsonResponse.data) ? jsonResponse.data : [];
        
        // Нормализация данных - убедимся, что все продукты имеют поля в едином формате
        return products.map((product: any) => ({
          id: product.id,
          name: product.name || product.title || '',
          title: product.title || product.name || '', // Для обратной совместимости
          description: product.description || '',
          price: product.price || 0,
          imageUrl: product.imageUrl || product.image || '',
          image: product.image || product.imageUrl || '', // Для обратной совместимости
          category: product.category || 'other',
          stock: product.stock || 0
        }));
      } catch (jsonError) {
        console.error('Failed to fetch products from JSON:', jsonError);
        return rejectWithValue('Не удалось загрузить продукты');
      }
    }
  }
);

// Добавим новый экшен для синхронизации редакс стора с продуктами после добавления/удаления/редактирования
export const addProduct = createAsyncThunk(
  'data/addProduct',
  async (product: Product, { dispatch }) => {
    // После добавления товара, обновляем весь список
    await dispatch(fetchProducts());
    return product;
  }
);

export const deleteProduct = createAsyncThunk(
  'data/deleteProduct',
  async (id: string, { dispatch }) => {
    // После удаления товара, обновляем весь список
    await dispatch(fetchProducts());
    return id;
  }
);

export const updateProduct = createAsyncThunk(
  'data/updateProduct',
  async (product: Product, { dispatch }) => {
    // После обновления товара, обновляем весь список
    await dispatch(fetchProducts());
    return product;
  }
);

export const fetchDistricts = createAsyncThunk(
  'data/fetchDistricts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/districts');
      return response.data;
    } catch (error) {
      return rejectWithValue('Не удалось загрузить районы');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Обработка текстур
    builder.addCase(fetchTextures.pending, (state) => {
      state.textures.loading = true;
      state.textures.error = null;
    });
    builder.addCase(fetchTextures.fulfilled, (state, action: PayloadAction<Texture[]>) => {
      state.textures.items = action.payload;
      state.textures.loading = false;
    });
    builder.addCase(fetchTextures.rejected, (state, action) => {
      state.textures.loading = false;
      state.textures.error = action.payload as string;
    });

    // Обработка продуктов
    builder.addCase(fetchProducts.pending, (state) => {
      state.products.loading = true;
      state.products.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      state.products.items = action.payload;
      state.products.loading = false;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.products.loading = false;
      state.products.error = action.payload as string;
    });

    // Обработка районов
    builder.addCase(fetchDistricts.pending, (state) => {
      state.districts.loading = true;
      state.districts.error = null;
    });
    builder.addCase(fetchDistricts.fulfilled, (state, action: PayloadAction<District[]>) => {
      state.districts.items = action.payload;
      state.districts.loading = false;
    });
    builder.addCase(fetchDistricts.rejected, (state, action) => {
      state.districts.loading = false;
      state.districts.error = action.payload as string;
    });
  }
});

export default dataSlice.reducer; 