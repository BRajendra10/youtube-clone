import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice.js";
import subscriptionReducer from "../features/subscriptionSlice.js";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { Subscriptions } from "../pages/Subscriptions.jsx";

const rootReducer = combineReducers({
  user: userReducer,
  subscription: subscriptionReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
