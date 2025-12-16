import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice.js";
import subscriptionReducer from "../features/subscriptionSlice.js";
import videoReducers from '../features/videoSlice.js'
import playlistReducers from '../features/playlistSlice.js';
import postReducers from '../features/postSlice.js';

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
  video: videoReducers,
  playlist: playlistReducers,
  post: postReducers
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
