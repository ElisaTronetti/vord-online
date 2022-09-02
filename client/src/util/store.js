import { configureStore } from '@reduxjs/toolkit'
import allReducers from '../redux'
import storage from 'redux-persist/lib/storage/session'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
  key: "user",
  storage
}

// Using the created combined reducer to create a persist reducer
const persistedReducer = persistReducer(persistConfig, allReducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})

export const persistor = persistStore(store)