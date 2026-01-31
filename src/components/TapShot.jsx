import React, { useEffect } from "react";
import "./TapShot.css";

const TapShot = () => {
  useEffect(() => {
    document.title = "TapShot - Shooter for Apple Watch";
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white/20">
      {/* Navigation / Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="TapShot App Icon"
              className="h-10 w-10 rounded-xl shadow-lg ring-1 ring-white/10"
            />
            <span className="font-bold text-lg tracking-tight text-white hidden md:block">
              TapShot
            </span>
          </div>

          <a
            href="https://apps.apple.com/app/idYOUR_APP_ID"
            className="group flex items-center gap-2 bg-white text-black hover:bg-zinc-200 transition-colors px-4 py-2 rounded-full font-medium text-sm md:text-base"
            aria-label="Download on the App Store"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 fill-current"
              viewBox="0 0 384 512"
            >
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 92.1 77.6 92.1 29.7 0 36.8-19.1 76.5-19.1 38.3 0 49.3 19.1 77.3 19.1 31.8 0 62.4-53.1 75.9-88.4-59-25.2-66.9-63.7-67-89.7M248 74.9c19.6-25.1 31.3-59.5 28.5-90.8-27.1 1.7-60.6 18.6-80.5 42-18.2 21.1-33.1 55.4-28.5 89.4 30.7 2.1 61-15.6 80.5-40.6" />
            </svg>
            <span>Download</span>
          </a>
        </div>
      </nav>

      {/* Main Content - Added top padding for fixed nav */}
      <main className="pt-24 md:pt-32">
        <section className="w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-20 text-center space-y-4">
              <h2 className="!text-3xl !mb-4 md:!text-5xl lg:!text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                Designed for Apple Watch
              </h2>
              <p className="text-lg md:text-xl text-zinc-400 font-medium">
                Fast taps. Clean shots. No ads. Pay once.
              </p>
            </div>

            {/* Gallery Container */}
            <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-6 px-4 -mx-4 pb-12 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-16 md:px-0 md:mx-0 md:overflow-visible md:pb-0 scrollbar-hide">
              {[
                {
                  id: 1,
                  headline: "Shoot with a Tap",
                  caption: "Instant response. No setup.",
                  placeholder: "Gameplay Action",
                },
                {
                  id: 2,
                  headline: "Built for the Wrist",
                  caption: "Designed for Apple Watch — not shrunk from iPhone.",
                  placeholder: "Watch Interface",
                },
                {
                  id: 3,
                  headline: "Pure Satisfaction",
                  caption: "Clean effects, smooth motion, tactile feedback.",
                  placeholder: "Particle Effects",
                },
                {
                  id: 4,
                  headline: "Play Anywhere",
                  caption:
                    "Perfect for short breaks, waiting, or winding down.",
                  placeholder: "Quick Session",
                },
                {
                  id: 5,
                  headline: "Everything Included",
                  caption: "One-time purchase. No ads. No in-app purchases.",
                  placeholder: "No Ads UI",
                },
              ].map((shot) => (
                <div
                  key={shot.id}
                  className="snap-center shrink-0 w-[80vw] max-w-[320px] md:w-auto flex flex-col items-center group"
                >
                  {/* Watch Frame */}
                  <div className="relative aspect-[4/5] w-full max-w-[260px] rounded-[2.5rem] border-[8px] border-zinc-800 bg-black shadow-2xl transition-transform duration-500 ease-out group-hover:scale-105 group-hover:shadow-zinc-900/50 overflow-hidden ring-1 ring-white/10">
                    {/* Screen Content */}
                    <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center overflow-hidden">
                      {/* Placeholder for Screenshot */}
                      {/* REPLACE THIS DIV WITH YOUR IMG TAG LATER */}
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <div className="w-12 h-12 rounded-full bg-zinc-700/50 mb-4 flex items-center justify-center">
                          <span className="text-2xl">⚡️</span>
                        </div>
                        <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-2">
                          {shot.placeholder}
                        </span>
                        <span className="text-zinc-600 text-[10px]">
                          [Insert Screenshot]
                        </span>
                      </div>
                    </div>

                    {/* Glass/Glare Overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10 bg-gradient-to-tr from-white/5 to-transparent"></div>
                  </div>

                  {/* Text Content */}
                  <div className="mt-8 text-center px-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {shot.headline}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {shot.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="text-sm text-zinc-500 font-medium">
                All features shown are included in the one-time purchase.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-zinc-950 text-center">
        <p className="text-zinc-600 text-sm">
          © 2026 TapShot. All rights reserved.{" "}
          <span className="mx-2 text-zinc-800">|</span>{" "}
          <a href="#" className="hover:text-white transition-colors">
            Support
          </a>
        </p>
      </footer>
    </div>
  );
};

export default TapShot;
