import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />

      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
