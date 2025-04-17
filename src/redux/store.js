import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./auth/authSlice";
import plansReducer from "./plan/plansSlice";
import workspaceReducer from "./workspace/workspaceSlice";
import currentWorkspaceReducer from "./currentworkspace/currentWorkspaceSlice"; 
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";


const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], 
};

const workspacePersistConfig = {
  key: "workspace",
  storage,
  whitelist: ["workspaces"],
};

const currentWorkspacePersistConfig = {
  key: "currentWorkspace",
  storage,
  whitelist: ["currentWorkspace","members","projects","currentProject"], 
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedWorkspaceReducer = persistReducer(workspacePersistConfig, workspaceReducer);
const persistedCurrentWorkspaceReducer = persistReducer(
  currentWorkspacePersistConfig,
  currentWorkspaceReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,  
    plans: plansReducer,        
    workspace: persistedWorkspaceReducer,
    currentWorkspace: persistedCurrentWorkspaceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
