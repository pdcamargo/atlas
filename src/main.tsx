import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.scss";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import NiceModal from "@ebay/nice-modal-react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NiceModal.Provider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />

        <Toaster />
      </ThemeProvider>
    </NiceModal.Provider>
  </React.StrictMode>
);
