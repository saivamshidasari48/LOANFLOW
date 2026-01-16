import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * Application bootstrap.
 * Creates the React root and mounts the main App component.
 */
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* StrictMode helps detect potential issues during development */}
    <App />
  </React.StrictMode>
);

