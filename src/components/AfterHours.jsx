import { useEffect, useRef, useState } from "react";

/*
 * A small hidden gem on the footer's top edge: a golden-angle seed ball
 * (Math·beauty) and three A B C toy blocks (the kid games), rendered by
 * three/AfterHoursScene.js. The caption under them is the real navigation:
 * it says "Pick one up." and turns into a link for whichever object is
 * hovered, focused or tapped. On touch, the first tap picks an object up and
 * the second opens it. Without WebGL the caption just shows both links.
 */

const ITEMS = [
  { id: "math", href: "/math-beauty/", name: "Math·beauty", note: "patterns from simple rules" },
  { id: "kids", href: "/kid-game/", name: "Kid games", note: "eight games for small hands" },
];

// CSS px of canvas below the footer's top edge; the scene puts its shelf line here.
const BELOW = 18;
const LINGER_MS = 900;

export default function AfterHours() {
  const rootRef = useRef(null);
  const shelfRef = useRef(null);
  const sceneRef = useRef(null);
  const selectedRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle, ready or fallback
  const [hovered, setHovered] = useState(null);
  const [recent, setRecent] = useState(null);
  const [captionHover, setCaptionHover] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);

  const active = hovered ?? captionHover ?? focused ?? selected ?? recent;
  selectedRef.current = selected;

  // Load three.js and the scene only as the footer comes near.
  useEffect(() => {
    const el = shelfRef.current;
    if (!el) return undefined;
    let scene;
    let cancelled = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const open = (id) => {
      const item = ITEMS.find((i) => i.id === id);
      if (item) window.location.assign(item.href);
    };

    const load = async () => {
      try {
        // The block letters are drawn in Fraunces, so it has to be ready first.
        await document.fonts?.load('600 64px "Fraunces"').catch(() => undefined);
        const { AfterHoursScene } = await import("./three/AfterHoursScene.js");
        if (cancelled) return;
        scene = new AfterHoursScene(el, {
          reducedMotion,
          below: BELOW,
          onHover: setHovered,
          onPick: (id, pointerType) => {
            if (pointerType === "mouse" || selectedRef.current === id) open(id);
            else setSelected(id);
          },
        });
        sceneRef.current = scene;
        scene.start();
        setStatus("ready");
      } catch (error) {
        console.warn("After-hours shelf unavailable, showing plain links.", error);
        if (!cancelled) setStatus("fallback");
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      sceneRef.current = null;
      scene?.dispose();
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setActive(active);
  }, [active, status]);

  // Keep the last hovered object's link up for a moment, so the pointer can
  // travel from the object down to its link in the caption.
  const lastHoverRef = useRef(null);
  useEffect(() => {
    if (hovered) {
      lastHoverRef.current = hovered;
      setRecent(null);
      return undefined;
    }
    const last = lastHoverRef.current;
    if (!last) return undefined;
    lastHoverRef.current = null;
    setRecent(last);
    const timer = setTimeout(() => setRecent(null), LINGER_MS);
    return () => clearTimeout(timer);
  }, [hovered]);

  // A tap anywhere else puts a picked-up object back down.
  useEffect(() => {
    if (!selected) return undefined;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setSelected(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [selected]);

  const showCaption = status !== "idle" || focused !== null;

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-x-0 top-0 z-10">
      <div className="relative mx-auto max-w-7xl px-6">
        <div
          ref={shelfRef}
          style={{ "--below": `${BELOW}px` }}
          className={`absolute right-6 top-[calc(var(--below)-92px)] h-[92px] w-[212px] transition-opacity duration-1000 lg:top-[calc(var(--below)-118px)] lg:h-[118px] lg:w-[276px] ${
            status === "ready" ? "pointer-events-auto opacity-100" : "opacity-0"
          }`}
        />

        <p
          className={`absolute right-6 top-6 text-right font-display text-[13px] italic text-sand-400 transition-opacity duration-700 sm:text-sm ${
            showCaption ? "opacity-100" : "opacity-0"
          }`}
        >
          {status === "fallback" ? (
            <>
              Fig. 02 · Made after hours:{" "}
              {ITEMS.map((item, i) => (
                <span key={item.id}>
                  {i > 0 && " · "}
                  <a
                    href={item.href}
                    className="pointer-events-auto text-sand-100 underline decoration-sand-500 underline-offset-4 transition-colors hover:text-sand-50"
                  >
                    {item.name}
                  </a>
                </span>
              ))}
            </>
          ) : (
            // Three lines stacked in one grid cell, right-aligned, crossfading.
            <span className="inline-grid justify-items-end">
              <span
                aria-hidden={active !== null}
                className={`[grid-area:1/1] transition-opacity duration-300 ${active ? "opacity-0" : "opacity-100"}`}
              >
                Fig. 02 · Made after hours. Pick one up.
              </span>
              {ITEMS.map((item) => {
                const on = active === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onFocus={() => setFocused(item.id)}
                    onBlur={() => setFocused(null)}
                    onPointerEnter={() => setCaptionHover(item.id)}
                    onPointerLeave={() => setCaptionHover(null)}
                    className={`whitespace-nowrap rounded-sm [grid-area:1/1] transition-opacity duration-300 ${
                      on ? "pointer-events-auto opacity-100" : "opacity-0"
                    }`}
                  >
                    <span aria-hidden="true">Fig. 02 · </span>
                    <span className="text-sand-50 underline decoration-clay-light underline-offset-4">{item.name}</span>
                    <span className="text-sand-300"> · {item.note}</span>
                    <span aria-hidden="true" className="ml-1.5 not-italic text-clay-light">
                      →
                    </span>
                  </a>
                );
              })}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
