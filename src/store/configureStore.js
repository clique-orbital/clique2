import { createStore, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import rootReducer from "./reducers";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ["form", "createEventsReducer", "eventModalReducer", "pollModal"]
  // whitelist: []
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);
export const persistor = persistStore(store);
