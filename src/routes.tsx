import { useCallback, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
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
import { MIN_WIDTH } from "./constants";

const MOBILE_REDIRECT_PATH = "not-supported";

export function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect) {
      sessionStorage.removeItem("redirect");
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  const handleResize = useCallback(() => {
    if (
      window.innerWidth < MIN_WIDTH &&
      location.pathname !== `/${MOBILE_REDIRECT_PATH}`
    ) {
      navigate(`/${MOBILE_REDIRECT_PATH}`, { replace: true });
    } else if (
      window.innerWidth >= MIN_WIDTH &&
      location.pathname === `/${MOBILE_REDIRECT_PATH}`
    ) {
      navigate(`/`, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

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
