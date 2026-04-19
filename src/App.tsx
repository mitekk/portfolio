import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { MainLayout } from "./layout/main.layout";
import { AppRoutes } from "./routes";
import { trackPageView } from "./services/analytics/initAnalytics";
import "./App.css";

function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <MainLayout>
      <BrowserRouter>
        <RouteTracker />
        <AppRoutes />
      </BrowserRouter>
    </MainLayout>
  );
}

export default App;
