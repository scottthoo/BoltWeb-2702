import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/effects/ScrollProgress";
import Hero from "./components/Hero";
import Services from "./components/Services";
import AutomationProcess from "./components/AutomationProcess";
import Recognition from "./components/Recognition";
import CoffeeMenu from "./components/CoffeeMenu";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import TapShot from "./components/TapShot";
import TapShotSupport from "./components/TapShotSupport";
import TapShotPrivacy from "./components/TapShotPrivacy";

/**
 * Links like "/#coffee" from another page load the homepage fresh, and the
 * browser looks for the fragment before React has rendered the section, so it
 * never scrolls. Once the page and its fonts are in place, scroll there ourselves.
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    let cancelled = false;
    const id = decodeURIComponent(hash.slice(1));
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!cancelled) document.getElementById(id)?.scrollIntoView();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, hash]);

  return null;
}

const MainLayout = () => (
  <div className="min-h-screen">
    <ScrollToHash />
    <ScrollProgress />
    <Navbar />
    <Outlet />
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tapshot" element={<TapShot />} />
        <Route path="/support" element={<TapShotSupport />} />
        <Route path="/tap-shot-privacy" element={<TapShotPrivacy />} />
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Services />
                <AutomationProcess />
                <Recognition />
                <CoffeeMenu />
              </>
            }
          />
          <Route
            path="/number-energy-converter-privacy-policy"
            element={<PrivacyPolicy />}
          />
          <Route path="/terms" element={<Terms />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
