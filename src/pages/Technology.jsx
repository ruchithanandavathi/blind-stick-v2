import { motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";
import PageHeader from "../components/PageHeader";

const COMPARISON = [
  { capability: "Run a neural network (YOLO) in real time", arduino: false, pi: true },
  { capability: "Process a live camera feed", arduino: false, pi: true },
  { capability: "Run a full speech recognition pipeline", arduino: false, pi: true },
  { capability: "Read simple sensors (ultrasonic, water)", arduino: true, pi: true },
  { capability: "Run a full operating system", arduino: false, pi: true },
  { capability: "Very low power, simple I/O tasks", arduino: true, pi: true },
  { capability: "Multitask several processes concurrently", arduino: false, pi: true },
];

function Check({ value }) {
  return value ? (
    <FiCheck className="text-mintOk mx-auto" size={18} />
  ) : (
    <FiX className="mx-auto" size={18} style={{ color: "var(--text-muted)" }} />
  );
}

export default function Technology() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Technology"
        title="Why Raspberry Pi, Not Arduino Alone"
        subtitle="Arduino is excellent for simple sensor logic, but real-time AI object detection needs real compute."
      />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-0 text-sm">
            <div className="p-4 font-mono text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Capability</div>
            <div className="p-4 font-mono text-xs uppercase tracking-wide text-center w-24">Arduino</div>
            <div className="p-4 font-mono text-xs uppercase tracking-wide text-center w-24 text-cyanGlow">Raspberry Pi</div>
            {COMPARISON.map((row, i) => (
              <motion.div
                key={row.capability}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="contents"
              >
                <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>{row.capability}</div>
                <div className="p-4 border-t flex items-center justify-center w-24" style={{ borderColor: "var(--border)" }}><Check value={row.arduino} /></div>
                <div className="p-4 border-t flex items-center justify-center w-24" style={{ borderColor: "var(--border)" }}><Check value={row.pi} /></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-28">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="glass rounded-2xl p-7">
          <h3 className="font-display text-xl font-semibold mb-3">The Core Reason</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Arduino microcontrollers are 8-bit (or simple 32-bit) chips with kilobytes of RAM —
            perfect for reading a sensor and triggering a buzzer, but nowhere near capable enough
            to decode a video frame, run a convolutional neural network, and produce a result fast
            enough to be useful in real time. Raspberry Pi runs a real operating system with a much
            faster CPU and enough memory to load a trained YOLO model and run continuous inference
            on a live camera stream, while also juggling GPS polling, GSM messaging, and speech
            recognition at the same time. That combination — real-time AI plus multitasking — is
            the entire reason this project is Pi-based rather than Arduino-based.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
