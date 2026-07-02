import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Sparkles, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import SmartStickModel from "./3d/SmartStickModel";
import ComponentPanel from "./ComponentPanel";
import { COMPONENTS, COMPONENT_ORDER } from "../data/components";

const VIEW_PRESETS = {
  front: [0, 1.2, 4.2],
  back:  [0, 1.2, -4.2],
  left:  [-4.2, 1.2, 0],
  right: [4.2, 1.2, 0],
  top:   [0, 5.5, 0.01],
  bottom:[0, -4, 0.01],
};

// Scroll-driven auto-activate order
const SCROLL_ORDER = COMPONENT_ORDER;

export default function Explorer({ id }) {
  const [active, setActive]       = useState(null);
  const [hovered, setHovered]     = useState(null);
  const [exploded, setExploded]   = useState(false);
  const [wiring, setWiring]       = useState(false);
  const [scrollIdx, setScrollIdx] = useState(-1);
  const controlsRef = useRef();
  const sectionRef  = useRef();

  // Scroll-triggered component cycling
  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < 0 && rect.bottom > 0;
      if (!inView) return;
      const progress = Math.abs(rect.top) / (rect.height - window.innerHeight);
      const idx = Math.min(Math.floor(progress * SCROLL_ORDER.length), SCROLL_ORDER.length - 1);
      if (idx !== scrollIdx) {
        setScrollIdx(idx);
        setActive(SCROLL_ORDER[idx]);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [scrollIdx]);

  const setView = useCallback((preset) => {
    if (!controlsRef.current) return;
    const [x, y, z] = VIEW_PRESETS[preset];
    controlsRef.current.object.position.set(x, y, z);
    controlsRef.current.target.set(0, 1, 0);
    controlsRef.current.update();
  }, []);

  const handleManualSelect = (key) => {
    setActive(key);
    setScrollIdx(-1); // user took over
  };

  return (
    <section ref={sectionRef} id={id} className="relative w-full py-24 px-6"
      style={{ minHeight: "220vh" }} // tall so scroll-activation works
    >
      {/* Sticky canvas + panel container */}
      <div className="sticky top-20 z-10">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-3">
            01 — Hardware Explorer
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Explore the Smart Blind Stick
          </h2>
          <p className="mt-2 max-w-xl mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
            Drag to rotate · scroll to zoom · double-click resets · hover glows · click opens details.
            Scroll down to auto-tour every component.
          </p>
        </div>

        {/* View mode toggles */}
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center mb-4">
          {/* Exploded View */}
          <button
            onClick={() => { setExploded(v => !v); setWiring(false); }}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wide transition-colors border ${
              exploded ? "bg-cyanGlow text-black border-cyanGlow" : "glass hover:border-cyanGlow/50"
            }`}
            style={exploded ? {} : { color: "var(--text-muted)" }}
          >
            {exploded ? "✕ Exploded View" : "⊞ Exploded View"}
          </button>
          {/* Internal Connections */}
          <button
            onClick={() => { setWiring(v => !v); setExploded(false); }}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wide transition-colors border ${
              wiring ? "bg-amberWarn text-black border-amberWarn" : "glass hover:border-amberWarn/50"
            }`}
            style={wiring ? {} : { color: "var(--text-muted)" }}
          >
            {wiring ? "✕ Internal Connections" : "⬡ Internal Connections"}
          </button>
          {/* Reset */}
          <button
            onClick={() => { setActive(null); setExploded(false); setWiring(false); setScrollIdx(-1); setView("front"); }}
            className="px-4 py-2 rounded-full glass text-xs font-mono uppercase tracking-wide hover:border-cyanGlow/40 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            ↺ Reset
          </button>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_360px] gap-6 items-start">
          {/* 3D Canvas */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden glass h-[520px] relative shadow-[0_0_60px_rgba(0,212,255,0.08)]">
              <Canvas
                camera={{ position: [0, 1.2, 4.2], fov: 42 }}
                onDoubleClick={() => setView("front")}
                shadows
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.4} />
                  <spotLight position={[4, 6, 4]} angle={0.25} intensity={2.5} color="#00d4ff" castShadow />
                  <spotLight position={[-4, 2, -4]} angle={0.35} intensity={1.2} color="#1e5fff" />
                  <spotLight position={[0, -3, 2]} angle={0.4} intensity={0.6} color="#ffffff" />
                  <Sparkles count={60} scale={5} size={1.2} speed={0.15} color="#00d4ff" opacity={0.3} />
                  <SmartStickModel
                    activeComponent={active}
                    onSelect={handleManualSelect}
                    onHover={setHovered}
                    autoRotate={!active && !exploded}
                    exploded={exploded}
                    showWiring={wiring}
                  />
                  <OrbitControls
                    ref={controlsRef}
                    enablePan={false}
                    minDistance={2}
                    maxDistance={9}
                    target={[0, 1, 0]}
                  />
                  <Environment preset="warehouse" />
                </Suspense>
              </Canvas>

              {/* Hovered tooltip */}
              <AnimatePresence>
                {hovered && !active && COMPONENTS[hovered] && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 left-4 glass rounded-full px-4 py-1.5 text-xs font-mono text-cyanGlow pointer-events-none"
                  >
                    ◎ {COMPONENTS[hovered].name}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active component name badge */}
              <AnimatePresence>
                {active && COMPONENTS[active] && (
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-4 left-4 glass rounded-xl px-4 py-2 text-xs font-mono"
                  >
                    <span className="text-cyanGlow">● </span>
                    {COMPONENTS[active].name}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Exploded label overlay */}
              {exploded && (
                <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-[10px] font-mono text-amberWarn">
                  EXPLODED VIEW
                </div>
              )}
              {wiring && (
                <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-[10px] font-mono text-amberWarn">
                  INTERNAL WIRING
                </div>
              )}
            </div>

            {/* View presets */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {Object.keys(VIEW_PRESETS).map(p => (
                <button
                  key={p}
                  onClick={() => setView(p)}
                  className="px-3 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-wide hover:text-cyanGlow hover:border-cyanGlow/40 transition-colors capitalize"
                  style={{ color: "var(--text-muted)" }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Component chips */}
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
              {COMPONENT_ORDER.map(key => (
                <button
                  key={key}
                  onClick={() => handleManualSelect(key === active ? null : key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    active === key
                      ? "bg-cyanGlow text-black border-cyanGlow shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                      : "border-white/10 hover:border-cyanGlow/40 hover:text-cyanGlow"
                  }`}
                  style={active === key ? {} : { color: "var(--text-muted)" }}
                >
                  {COMPONENTS[key]?.name}
                </button>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="md:sticky md:top-24 min-h-[300px] flex items-start overflow-y-auto max-h-[80vh]">
            {active && COMPONENTS[active] ? (
              <ComponentPanel
                data={COMPONENTS[active]}
                onClose={() => { setActive(null); setScrollIdx(-1); }}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-6 text-center text-sm w-full"
                style={{ color: "var(--text-muted)" }}
              >
                <div className="text-2xl mb-3">🔬</div>
                <p>Click a component on the 3D model<br />or use the chips below the canvas<br />to inspect it in full detail.</p>
                <p className="mt-4 text-xs font-mono text-cyanGlow/60">↓ Or just scroll down to auto-tour</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
