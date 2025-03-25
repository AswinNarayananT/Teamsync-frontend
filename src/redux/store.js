import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./auth/authSlice";
import plansReducer from "./plan/plansSlice";
import workspaceReducer from "./workspace/workspaceSlice";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";


const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], 
};

const workspacePersistConfig = {
  key: "workspace",
  storage,
  whitelist: ["workspaces", "currentWorkspace"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedWorkspaceReducer = persistReducer(workspacePersistConfig, workspaceReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,  
    plans: plansReducer,        
    workspace: persistedWorkspaceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
