import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.scss";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import NiceModal from "@ebay/nice-modal-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NiceModal.Provider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>

        <Toaster />
      </ThemeProvider>
    </NiceModal.Provider>
  </React.StrictMode>
);
