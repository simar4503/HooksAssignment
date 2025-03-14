import React from "react";
import ReactDOM from "react-dom/client"; // Use `react-dom/client` for React 18+
import "./index.css"; // Global styles
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext"; // If using ThemeContext

// Use createRoot to render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
