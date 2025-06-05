import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Recognition from "./components/Recognition";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
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
          <Route
            path="/terms"
            element={<Terms />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
