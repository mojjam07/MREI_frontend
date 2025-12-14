

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n/i18n";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CombinedDashboardProvider } from "./context/DashboardContext";
import { NotificationProvider } from "./context/NotificationContext";


const client = new QueryClient();

const RootComponent = () => (
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <CombinedDashboardProvider>
                <App />
              </CombinedDashboardProvider>
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")).render(<RootComponent />);

export default RootComponent;
