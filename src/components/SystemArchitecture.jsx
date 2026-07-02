import { motion } from "framer-motion";

const PIPELINES = [
  { title: "Detection Pipeline", color: "#00d4ff", steps: ["Camera", "Raspberry Pi", "YOLO AI Model", "Object Detection", "Voice Generation", "Speaker"] },
  { title: "Navigation Pipeline", color: "#1e5fff", steps: ["GPS", "Navigation Engine", "Voice Output"] },
  { title: "Emergency Pipeline", color: "#ff4d4d", steps: ["SOS Button", "GSM Module", "Family Notified"] },
];

function Pipeline({ title, color, steps, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-6"
    >
      <div className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color }}>{title}</div>
      <div className="flex flex-col gap-0">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
              {i < steps.length - 1 && (
                <motion.div
                  className="w-px h-8"
                  style={{ background: color }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: delay + i * 0.1 }}
                />
              )}
            </div>
            <div className="text-sm" style={{ paddingBottom: i < steps.length - 1 ? "1.7rem" : 0 }}>{s}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SystemArchitecture() {
  return (
    <section className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-3">06 — System Architecture</div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold">Three Pipelines, One System</h2>
        <p className="mt-3 max-w-lg mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
          Detection, navigation, and emergency response run as independent but coordinated
          processes on the same Raspberry Pi.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
        {PIPELINES.map((p, i) => (
          <Pipeline key={p.title} {...p} delay={i * 0.12} />
        ))}
      </div>
    </section>
  );
}
