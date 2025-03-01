import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import globalReducer from "./state";
import { api } from "./state/api";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  WebStorage,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import React from "react";

/* REDUX PERSISTENCE */
// Define a compatible storage interface that works with redux-persist
interface NoopStorage {
  getItem(key: string): Promise<null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const createNoopStorage = (): NoopStorage => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getItem(key: string) {
      return Promise.resolve(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setItem(key: string, value: string) {
      return Promise.resolve();
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeItem(key: string) {
      return Promise.resolve();
    },
  };
};

const storage: WebStorage | NoopStorage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global"],
};

const rootReducer = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* REDUX STORE */
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  const persistor = persistStore(storeRef.current);
  
  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}