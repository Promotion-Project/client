import { configureStore } from '@reduxjs/toolkit';
import promotionReducer from './reducers/promotionReducer';

const store = configureStore({
  reducer: {
    promotion: promotionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;