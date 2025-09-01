import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from "./App.jsx";
import "./index.css";

export const Context = createContext({
  isAuthorized: false,
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Provider store={store}>
      <Context.Provider
        value={{
          isAuthorized,
          setIsAuthorized,
          user,
          setUser,
        }}
      >
        <App />
      </Context.Provider>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
