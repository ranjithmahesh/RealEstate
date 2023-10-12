import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user";
const rootReducer = combineReducers({ user: userReducer });

const persistconfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedRuducer = persistReducer(persistconfig, rootReducer);
export const store = configureStore({
  reducer: persistedRuducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
