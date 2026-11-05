import { useEffect, useRef, useState } from "react";

/**
 * Mounts the interactive three.js bolt. three.js is loaded as a separate chunk
 * after first paint, so the hero copy and CTA never wait on it. Without WebGL
 * the static bolt below stands in.
 */
export default function BoltCanvas({ className = "" }) {
  const ref = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let scene;
    let cancelled = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("./BoltScene.js")
      .then(({ BoltScene }) => {
        if (cancelled) return;
        scene = new BoltScene(el, { reducedMotion });
        scene.start();
        setStatus("ready");
      })
      .catch((error) => {
        console.warn("Bolt 3D hero unavailable, showing the static bolt.", error);
        if (!cancelled) setStatus("fallback");
      });

    return () => {
      cancelled = true;
      scene?.dispose();
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={ref}
        role="img"
        aria-label="Clay blocks assembling into a lightning bolt"
        className={`absolute inset-0 cursor-crosshair transition-opacity duration-1000 ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />
      {status === "fallback" && <StaticBolt />}
    </div>
  );
}

function StaticBolt() {
  return (
    <svg
      viewBox="0 0 448 512"
      role="img"
      aria-label="Bolt Interactive lightning bolt"
      className="absolute left-1/2 top-1/2 h-3/5 -translate-x-1/2 -translate-y-1/2 drop-shadow-[18px_24px_24px_rgba(91,58,30,0.22)]"
    >
      <path
        fill="#B4532A"
        d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"
      />
    </svg>
  );
}
