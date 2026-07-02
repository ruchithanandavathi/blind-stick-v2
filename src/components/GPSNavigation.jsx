import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiNavigation, FiVolume2 } from "react-icons/fi";
import { GOOGLE_MAPS_API_KEY, USE_REAL_MAPS, DEFAULT_LOCATION } from "../config/maps";

const NAV_STEPS = ["Go straight", "Turn left", "Go straight", "Turn right", "Destination reached"];

function SimulatedMap() {
  const [step, setStep] = useState(0);
  const [markerPos, setMarkerPos] = useState({ x: 20, y: 75 });

  const path = [
    { x: 20, y: 75 },
    { x: 40, y: 60 },
    { x: 40, y: 35 },
    { x: 68, y: 35 },
    { x: 80, y: 18 },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => {
        const next = (s + 1) % NAV_STEPS.length;
        setMarkerPos(path[next]);
        return next;
      });
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden glass">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--bg-elevated), var(--bg))" }} />
      <div className="absolute inset-0 opacity-25 grid-backdrop" style={{ backgroundSize: "32px 32px" }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={path.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#00d4ff"
          strokeWidth="0.8"
          strokeDasharray="2 1.5"
          opacity="0.7"
        />
      </svg>

      <div className="absolute" style={{ left: `${path[path.length - 1].x}%`, top: `${path[path.length - 1].y}%`, transform: "translate(-50%, -100%)" }}>
        <FiMapPin className="text-amberWarn" size={20} />
      </div>

      <motion.div
        className="absolute w-3 h-3 rounded-full bg-cyanGlow shadow-[0_0_12px_#00d4ff]"
        animate={{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ transform: "translate(-50%, -50%)" }}
      />

      <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-mintOk uppercase tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-mintOk animate-pulse" /> Live Location (Simulated)
      </div>
    </div>
  );
}

export default function GPSNavigation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % NAV_STEPS.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-3">04 — Real-Time GPS Navigation</div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold">Knowing the Way, Every Step</h2>
        <p className="mt-3 max-w-lg mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
          Live location tracking feeds both turn-by-turn voice guidance and the emergency SOS
          system.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {USE_REAL_MAPS && GOOGLE_MAPS_API_KEY ? (
          <iframe
            title="Live Map"
            className="w-full aspect-video rounded-2xl glass"
            src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${DEFAULT_LOCATION.lat},${DEFAULT_LOCATION.lng}`}
            loading="lazy"
          />
        ) : (
          <SimulatedMap />
        )}

        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 glass rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
          {step === NAV_STEPS.length - 1 ? <FiMapPin className="text-mintOk shrink-0" /> : <FiNavigation className="text-cyanGlow shrink-0" />}
          <span className="flex-1">{NAV_STEPS[step]}</span>
          <FiVolume2 className="opacity-50" size={14} />
        </motion.div>

        {!USE_REAL_MAPS && (
          <p className="text-center text-xs mt-3 font-mono" style={{ color: "var(--text-muted)" }}>
            Add a Google Maps API key in <code>src/config/maps.js</code> to switch this to a live
            embedded map.
          </p>
        )}
      </div>
    </section>
  );
}
