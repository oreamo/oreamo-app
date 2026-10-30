import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { App } from "@/app/App";

import "@/libs/ag-grid-config";
import "@/libs/dayjs-config";

import "@/assets/styles/font.css";
import "@/assets/styles/global.css";
import "@/assets/styles/init.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
