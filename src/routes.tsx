import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  BuzzPage,
  IntroPage,
  About,
  Experience,
  NotFoundPage,
  Toolbox,
  NotSupportedPage,
} from "./pages";
import { MOBILE_REDIRECT_PATH } from "./constants";

export function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect) {
      sessionStorage.removeItem("redirect");
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/theBuzz" element={<BuzzPage />}>
        <Route index element={<Navigate to="about" replace />} />
        <Route path="about" element={<About />} />
        <Route path="toolbox" element={<Toolbox />} />
        <Route path="experience" element={<Experience />} />
      </Route>
      <Route
        path={`/${MOBILE_REDIRECT_PATH}`}
        element={<NotSupportedPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
