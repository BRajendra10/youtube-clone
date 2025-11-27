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


// ✔ Persist only currentUser in user slice
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["currentUser"],
};

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: [], // No slices persisted at root
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  subscription: subscriptionReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
      },
    }),
});

export const persistor = persistStore(store);
