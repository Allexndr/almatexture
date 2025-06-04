import { combineReducers } from 'redux';
import userReducer from './userSlice';
import uiReducer from './uiSlice';
import dataReducer from './dataSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  data: dataReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 