import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import "./App.css";
import { SyncProvider } from "./context/SyncProvider.tsx";
import { registerSW } from "virtual:pwa-register";
const updateSW = registerSW({
  immediate: true,
});
export { updateSW };

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SyncProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SyncProvider>
  </StrictMode>
);
