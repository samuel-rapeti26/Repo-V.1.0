import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from "redux-persist/lib/storage";
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';

import rootReducer from "./reducers";

import Login from "./login";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const router = createBrowserRouter([
    {
        path: "/dashboard",
        element: <App />,
    },
    {
        path: "/",
        element: <Login />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
        </PersistGate>
    </Provider>
);

reportWebVitals();
