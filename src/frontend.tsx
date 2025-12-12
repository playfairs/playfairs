/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeLoader from "./components/ThemeLoader";

if (!document.querySelector('meta[name="theme-color"]')) {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = '#191724';
  document.head.appendChild(meta);
}

function start() {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <ThemeProvider>
      <ThemeLoader />
      <App />
    </ThemeProvider>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
