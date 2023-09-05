import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ChatProvider from "./context/ChatProvider";
import 'react-toastify/dist/ReactToastify.css';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </React.StrictMode>
);
