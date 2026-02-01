import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Recognition from "./components/Recognition";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import TapShot from "./components/TapShot";
import TapShotSupport from "./components/TapShotSupport";
import TapShotPrivacy from "./components/TapShotPrivacy";

const MainLayout = () => (
  <div className="min-h-screen">
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
                <Recognition />
                <Contact />
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
