import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiVolume2, FiCamera } from "react-icons/fi";

const DETECTIONS = [
  { label: "Human",         confidence: 96, distance: "2.3m", voice: "Human detected 2.3 meters ahead.", x: 10, y: 12, w: 22, h: 62, color: "#00d4ff" },
  { label: "Car",           confidence: 88, distance: "5.1m", voice: "Car approaching from left.",         x: 60, y: 25, w: 32, h: 44, color: "#ff4d4d" },
  { label: "Bike",          confidence: 91, distance: "4.1m", voice: "Bike approaching from right.",       x: 62, y: 30, w: 26, h: 38, color: "#ffb340" },
  { label: "Door",          confidence: 93, distance: "3.0m", voice: "Door detected.",                     x: 35, y: 8,  w: 22, h: 68, color: "#00d4ff" },
  { label: "Stairs",        confidence: 87, distance: "1.8m", voice: "Stairs ahead — move carefully.",     x: 28, y: 62, w: 40, h: 22, color: "#ff4d4d" },
  { label: "Pole",          confidence: 84, distance: "2.0m", voice: "Pole ahead.",                        x: 6,  y: 20, w: 8,  h: 55, color: "#ffb340" },
  { label: "Traffic Signal",confidence: 90, distance: "6.2m", voice: "Traffic signal ahead.",              x: 72, y: 5,  w: 18, h: 28, color: "#3dffb0" },
  { label: "Water",         confidence: 82, distance: "0.8m", voice: "Water detected.",                    x: 20, y: 70, w: 55, h: 18, color: "#00d4ff" },
  { label: "Dog",           confidence: 78, distance: "3.5m", voice: "Animal detected 3.5 meters ahead.", x: 50, y: 45, w: 18, h: 28, color: "#ffb340" },
  { label: "Tree",          confidence: 85, distance: "1.5m", voice: "Tree — obstacle on right.",          x: 75, y: 10, w: 20, h: 62, color: "#3dffb0" },
];

const ALL_LABELS = ["Human", "Car", "Bike", "Door", "Chair", "Pole", "Stairs", "Traffic Signal", "Dog", "Tree", "Water"];

export default function ObjectDetection() {
  const [frameIdx, setFrameIdx] = useState(0);
  const [fps, setFps] = useState(12);

  useEffect(() => {
    const t = setInterval(() => {
      setFrameIdx(v => (v + 1) % DETECTIONS.length);
      setFps(Math.floor(10 + Math.random() * 6));
    }, 2600);
    return () => clearInterval(t);
  }, []);

  const active = DETECTIONS[frameIdx];
  // Show 1-3 simultaneous bounding boxes for realism
  const visibleBoxes = [active, DETECTIONS[(frameIdx + 3) % DETECTIONS.length]].filter(Boolean);

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-3">
          02 — Real-Time AI Object Detection
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold">
          Seeing the World, On-Device
        </h2>
        <p className="mt-3 max-w-lg mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
          The camera feeds a trained YOLO model running entirely on the Raspberry Pi. No cloud.
          Detections fire in real time with bounding boxes, confidence, and distance.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Camera feed simulation */}
        <div className="relative aspect-video rounded-2xl overflow-hidden glass shadow-[0_0_60px_rgba(0,212,255,0.08)]">
          {/* Simulated scene background */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0a1020 0%, #050a14 60%, #0a0a0a 100%)" }} />
          <div className="absolute inset-0 opacity-15 grid-backdrop" style={{ backgroundSize: "30px 30px" }} />

          {/* Fake scene depth lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 56">
            {/* Ground perspective lines */}
            <line x1="50" y1="35" x2="0"   y2="56" stroke="#444" strokeWidth="0.3" />
            <line x1="50" y1="35" x2="100" y2="56" stroke="#444" strokeWidth="0.3" />
            <line x1="50" y1="35" x2="50"  y2="0"  stroke="#444" strokeWidth="0.3" />
            {/* Horizon */}
            <line x1="0" y1="35" x2="100" y2="35" stroke="#333" strokeWidth="0.4" />
          </svg>

          {/* HUD overlays */}
          <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-mintOk uppercase tracking-wide">
            <FiCamera size={10} />
            <span className="w-1.5 h-1.5 rounded-full bg-mintOk animate-pulse" />
            Live — {fps} FPS
          </div>
          <div className="absolute top-3 right-3 font-mono text-[10px] text-cyanGlow/70">
            YOLO v8 · Pi5 · 640×480
          </div>

          {/* Bounding boxes */}
          <AnimatePresence mode="popLayout">
            {visibleBoxes.map((d, i) => (
              <motion.div
                key={d.label + frameIdx + i}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="absolute rounded"
                style={{
                  left: `${d.x}%`, top: `${d.y}%`,
                  width: `${d.w}%`, height: `${d.h}%`,
                  border: `2px solid ${d.color}`,
                  boxShadow: `0 0 12px ${d.color}55, inset 0 0 12px ${d.color}11`,
                }}
              >
                {/* Top-left label */}
                <div className="absolute -top-6 left-0 text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                  style={{ background: d.color }}>
                  {d.label} {d.confidence}%
                </div>
                {/* Bottom-right distance */}
                <div className="absolute -bottom-5 right-0 text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap glass"
                  style={{ color: d.color }}>
                  {d.distance}
                </div>
                {/* Corner marks */}
                {[["top-0 left-0 border-t border-l", "-top-px -left-px"], ["top-0 right-0 border-t border-r", "-top-px -right-px"]].map(([cls], j) => (
                  <div key={j} className={`absolute w-3 h-3 ${cls}`} style={{ borderColor: d.color }} />
                ))}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Scan line animation */}
          <motion.div
            className="absolute left-0 right-0 h-px opacity-30"
            style={{ background: "linear-gradient(90deg, transparent, #00d4ff, transparent)" }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
        </div>

        {/* Voice output bar */}
        <motion.div
          key={active.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass rounded-xl px-4 py-3.5 flex items-center gap-3"
        >
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-cyanGlow rounded-full"
                animate={{ height: [4, 16, 4, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
              />
            ))}
          </div>
          <FiVolume2 className="text-cyanGlow shrink-0" size={14} />
          <span className="text-sm">"{active.voice}"</span>
          <div className="ml-auto font-mono text-xs text-mintOk shrink-0">{active.distance}</div>
        </motion.div>

        {/* Detectable classes */}
        <div className="flex flex-wrap gap-2 mt-5 justify-center">
          {ALL_LABELS.map(l => (
            <span
              key={l}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                l === active.label ? "bg-cyanGlow text-black" : "glass"
              }`}
              style={l === active.label ? {} : { color: "var(--text-muted)" }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
