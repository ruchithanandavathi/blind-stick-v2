import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMic } from "react-icons/fi";

const CONVO = [
  { role: "user", text: "Where am I?" },
  { role: "ai", text: "You are near BMS College, Bengaluru." },
  { role: "user", text: "Navigate to home." },
  { role: "ai", text: "Starting navigation." },
  { role: "user", text: "Send my location." },
  { role: "ai", text: "Location sent successfully." },
  { role: "user", text: "Emergency help." },
  { role: "ai", text: "Emergency SMS sent." },
];

function VoiceWave({ active }) {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-0.5 bg-cyanGlow rounded-full"
          animate={active ? { height: [4, 16, 6, 14, 4] } : { height: 4 }}
          transition={{ duration: 0.8, repeat: active ? Infinity : 0, delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}

export default function AIAssistant() {
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !started) setStarted(true); }, { threshold: 0.4 });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || visible >= CONVO.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 1000);
    return () => clearTimeout(t);
  }, [started, visible]);

  return (
    <section ref={containerRef} className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-3">03 — Real-Time Voice Assistant</div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold">Talk to the Stick, Naturally</h2>
        <p className="mt-3 max-w-lg mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
          Speech recognition runs alongside detection on the same Raspberry Pi, responding to
          plain spoken requests in real time.
        </p>
      </div>

      <div className="max-w-md mx-auto glass rounded-2xl p-5 min-h-[380px] flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-3 border-b mb-1" style={{ borderColor: "var(--border)" }}>
          <div className="w-2 h-2 rounded-full bg-mintOk animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Voice Assistant — Live</span>
        </div>

        <AnimatePresence>
          {CONVO.slice(0, visible).map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm flex items-center gap-2 ${
                msg.role === "user" ? "bg-blueDeep/30 rounded-br-sm" : "bg-cyanGlow/10 text-cyanGlow rounded-bl-sm border border-cyanGlow/20"
              }`}>
                {msg.role === "user" && <FiMic size={13} className="shrink-0" />}
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {visible < CONVO.length && started && (
          <div className="flex items-center gap-2 text-xs pl-1" style={{ color: "var(--text-muted)" }}>
            <VoiceWave active /> listening…
          </div>
        )}

        {visible >= CONVO.length && (
          <button onClick={() => setVisible(0)} className="mt-2 self-center text-xs font-mono text-cyanGlow/70 hover:text-cyanGlow underline underline-offset-4">
            Replay conversation
          </button>
        )}
      </div>
    </section>
  );
}
