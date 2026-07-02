import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

function Pill({ children, tone = "cyan" }) {
  const tones = {
    cyan: "border-cyanGlow/40 text-cyanGlow bg-cyanGlow/10",
    amber: "border-amberWarn/40 text-amberWarn bg-amberWarn/10",
    mint: "border-mintOk/40 text-mintOk bg-mintOk/10",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${tones[tone]}`}>{children}</span>;
}

function Field({ label, children }) {
  if (!children) return null;
  return (
    <div className="mb-4">
      <div className="text-[11px] tracking-[0.18em] uppercase text-cyanGlow/70 font-mono mb-1.5">{label}</div>
      <div className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{children}</div>
    </div>
  );
}

export default function ComponentPanel({ data, onClose }) {
  if (!data) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-2xl p-6 w-full max-w-sm shadow-[0_0_60px_rgba(0,212,255,0.08)] relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 hover:text-cyanGlow transition-colors" style={{ color: "var(--text-muted)" }} aria-label="Close panel">
          <FiX size={18} />
        </button>

        <div className="mb-1 text-xs font-mono text-cyanGlow/80 tracking-widest uppercase">Component</div>
        <h3 className="font-display text-2xl font-semibold mb-1">{data.name}</h3>
        <p className="text-sm mb-5 italic" style={{ color: "var(--text-muted)" }}>{data.tagline}</p>

        <Field label="Purpose">{data.purpose}</Field>

        {data.connections && (
          <Field label="Pin Connections">
            <div className="flex flex-col gap-1 font-mono text-xs">
              {data.connections.map((c) => <div key={c} className="text-cyanGlow/90">{c}</div>)}
            </div>
          </Field>
        )}

        <Field label="Working Principle">{data.working}</Field>

        {data.whyNotArduino && (
          <Field label="Why Raspberry Pi, Not Arduino">
            <div className="bg-amberWarn/10 border border-amberWarn/30 rounded-lg p-3 text-xs leading-relaxed">
              {data.whyNotArduino}
            </div>
          </Field>
        )}

        {data.workflow && (
          <Field label="Workflow">
            <div className="flex flex-wrap items-center gap-1.5">
              {data.workflow.map((step, i) => (
                <span key={step} className="flex items-center gap-1.5">
                  <Pill tone="amber">{step}</Pill>
                  {i < data.workflow.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
                </span>
              ))}
            </div>
          </Field>
        )}

        {data.energyFlow && (
          <Field label="Energy Flow">
            <div className="flex flex-wrap items-center gap-1.5">
              {data.energyFlow.map((step, i) => (
                <span key={step} className="flex items-center gap-1.5">
                  <Pill tone="mint">{step}</Pill>
                  {i < data.energyFlow.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
                </span>
              ))}
            </div>
          </Field>
        )}

        {data.voiceOutput && (
          <Field label="Voice Output Examples">
            <div className="flex flex-wrap gap-1.5">{data.voiceOutput.map((v) => <Pill key={v}>"{v}"</Pill>)}</div>
          </Field>
        )}

        {data.examples && (
          <Field label="Example Phrases">
            <div className="flex flex-wrap gap-1.5">{data.examples.map((v) => <Pill key={v}>"{v}"</Pill>)}</div>
          </Field>
        )}

        {data.alert && <Field label="Alert">{data.alert}</Field>}

        {data.usedWhen && (
          <Field label="Activates When">
            <div className="flex flex-wrap gap-1.5">
              {data.usedWhen.map(v => <Pill key={v} tone="amber">{v}</Pill>)}
            </div>
          </Field>
        )}

        {data.messageExample && (
          <Field label="Sample SMS">
            <div className="font-mono text-xs bg-black/20 rounded-lg p-3 border border-cyanGlow/10">{data.messageExample}</div>
          </Field>
        )}

        {data.exampleOutput && (
          <Field label="Example Output">
            <div className="font-mono text-xs bg-black/20 rounded-lg p-3 border border-mintOk/20 text-mintOk">{data.exampleOutput}</div>
          </Field>
        )}

        {data.features && (
          <Field label="Features">
            <ul className="space-y-1">
              {data.features.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-cyanGlow">•</span>{f}</li>
              ))}
            </ul>
          </Field>
        )}

        {data.advantages && (
          <Field label="Advantages">
            <ul className="space-y-1">
              {data.advantages.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-mintOk">✓</span>{f}</li>
              ))}
            </ul>
          </Field>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
