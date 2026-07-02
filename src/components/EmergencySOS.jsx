import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiMapPin, FiSend, FiCheckCircle, FiSmartphone } from "react-icons/fi";

const STAGES = [
  { key: "location", label: "GPS Location Retrieved",   icon: FiMapPin,       color: "#00d4ff" },
  { key: "gsm",      label: "GSM Module Activated",     icon: FiSmartphone,   color: "#ffb340" },
  { key: "sending",  label: "SMS Sending…",             icon: FiSend,         color: "#ffb340" },
  { key: "delivered",label: "SMS Delivered ✓",          icon: FiCheckCircle,  color: "#3dffb0" },
];

export default function EmergencySOS() {
  const [stage, setStage]   = useState(-1);
  const [running, setRunning] = useState(false);

  const trigger = () => {
    if (running) return;
    setRunning(true);
    STAGES.forEach((_, i) => setTimeout(() => setStage(i), i * 1100));
    setTimeout(() => { setStage(-1); setRunning(false); }, STAGES.length * 1100 + 2000);
  };

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-3">05 — Emergency System</div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold">One Press for Help</h2>
        <p className="mt-3 max-w-lg mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
          The red SOS button instantly retrieves GPS location and sends an SMS with a live Google
          Maps link to a registered family contact via the GSM module.
        </p>
      </div>

      <div className="max-w-lg mx-auto glass rounded-2xl p-8">
        {/* SOS Button */}
        <div className="flex flex-col items-center mb-8">
          <motion.button
            onClick={trigger}
            disabled={running}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: running ? "radial-gradient(circle, #cc1111, #880000)" : "radial-gradient(circle, #ff2222, #aa0000)",
              boxShadow: running ? "0 0 50px rgba(255,50,50,0.7), 0 0 100px rgba(255,50,50,0.3)" : "0 0 30px rgba(255,50,50,0.5)",
            }}
          >
            {running && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-400"
                animate={{ scale: [1, 1.5, 1.5], opacity: [0.8, 0, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
            <FiAlertTriangle size={36} color="#fff" />
          </motion.button>
          <div className="text-xs font-mono mt-3 uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
            {running ? "ALERTING…" : "TAP TO SIMULATE SOS"}
          </div>
        </div>

        {/* Pipeline stages */}
        <div className="space-y-3">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const done = stage >= i;
            const current = stage === i;
            return (
              <motion.div
                key={s.key}
                animate={{ opacity: stage >= i - 1 || stage === -1 ? 1 : 0.3 }}
                className="flex items-center gap-4 glass rounded-xl px-4 py-3"
              >
                <motion.div
                  animate={{ scale: current ? [1, 1.2, 1] : 1 }}
                  transition={{ repeat: current ? Infinity : 0, duration: 0.6 }}
                >
                  <Icon size={18} style={{ color: done ? s.color : "var(--text-muted)" }} />
                </motion.div>
                <div className="flex-1 text-sm">{s.label}</div>
                <AnimatePresence>
                  {current && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex gap-0.5"
                    >
                      {[0,1,2].map(j => (
                        <motion.div key={j} className="w-1 h-1 rounded-full" style={{ background: s.color }}
                          animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, delay: j * 0.2, duration: 0.6 }} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {done && !current && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <FiCheckCircle size={14} style={{ color: s.color }} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Sample SMS message */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 font-mono text-xs rounded-xl p-4 border border-mintOk/30 leading-relaxed"
              style={{ background: "rgba(61,255,176,0.06)", color: "#3dffb0" }}
            >
              📨 <strong>SMS DELIVERED</strong><br /><br />
              HELP! I need immediate assistance.<br />
              My live location:<br />
              <span className="text-cyanGlow underline">maps.google.com/?q=12.9352,77.5345</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
