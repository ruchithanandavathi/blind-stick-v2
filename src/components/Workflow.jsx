import { motion } from "framer-motion";

const STEPS = [
  { label: "User Starts Stick", icon: "⏻" },
  { label: "Camera Captures Image", icon: "◎" },
  { label: "YOLO Model Detects Objects", icon: "▣" },
  { label: "Ultrasonic Calculates Distance", icon: "↔" },
  { label: "GPS Updates Location", icon: "⊕" },
  { label: "Voice Assistant Speaks", icon: "🔊" },
  { label: "Safe Navigation", icon: "✓" },
];

export default function Workflow() {
  return (
    <section className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-3">08 — End-to-End Workflow</div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold">From Power-On to Safe Step</h2>
      </div>

      <div className="max-w-md mx-auto relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-px trace-line" />
        <div className="flex flex-col gap-7">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex items-center gap-5 relative"
            >
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-cyanGlow shrink-0 z-10 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                {step.icon}
              </div>
              <div className="font-medium text-sm md:text-base">{step.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
