import { configureStore } from '@reduxjs/toolkit'
import { textApi } from './api/textApi'
import { authApi } from './api/authApi'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    [textApi.reducerPath]: textApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(textApi.middleware)
      .concat(authApi.middleware),
})
