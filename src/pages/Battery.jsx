import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSun, FiBatteryCharging, FiActivity } from "react-icons/fi";
import PageHeader from "../components/PageHeader";

function BatteryVisual({ level, charging }) {
  return (
    <div className="flex items-center gap-1">
      <div className="relative w-40 h-20 border-2 rounded-md p-1.5 flex" style={{ borderColor: "var(--text-muted)" }}>
        <motion.div
          className="h-full rounded-sm"
          style={{ background: level > 20 ? "#3dffb0" : "#ff4d4d" }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1 }}
        />
        {charging && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-black"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >
            <FiBatteryCharging size={22} />
          </motion.div>
        )}
      </div>
      <div className="w-2 h-8 rounded-r" style={{ background: "var(--text-muted)" }} />
    </div>
  );
}

export default function Battery() {
  const [level, setLevel] = useState(62);
  const [charging, setCharging] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setLevel((l) => {
        if (charging) return l >= 100 ? 100 : l + 2;
        return l <= 5 ? 5 : l - 1;
      });
    }, 600);
    return () => clearInterval(t);
  }, [charging]);

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Power System"
        title="Battery & Solar Charging"
        subtitle="Keeping the Raspberry Pi, sensors, and modules powered through a full day of outdoor use."
      />

      <div className="max-w-3xl mx-auto px-6 pb-28">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8 flex flex-col items-center text-center mb-6">
          <BatteryVisual level={level} charging={charging} />
          <div className="font-display text-3xl font-semibold mt-5">{level}%</div>
          <div className="text-xs font-mono uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>
            {charging ? "Charging from Solar" : "On Battery Power"}
          </div>
          <button
            onClick={() => setCharging((c) => !c)}
            className="mt-5 px-4 py-2 rounded-full glass text-xs font-mono uppercase tracking-wide hover:border-cyanGlow/50 transition-colors"
          >
            Toggle {charging ? "Discharge" : "Charging"}
          </button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: FiSun, title: "Solar Input", value: "0.4W trickle", note: "Mounted on the stick cap, sun-facing" },
            { icon: FiBatteryCharging, title: "Capacity", value: "Li-ion rechargeable", note: "Powers Pi + all connected modules" },
            { icon: FiActivity, title: "Battery Health", value: "Stable", note: "Low-battery voice warning below 15%" },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-6"
            >
              <c.icon className="text-cyanGlow mb-3" size={20} />
              <div className="font-display font-semibold text-sm mb-1">{c.title}</div>
              <div className="text-sm mb-1">{c.value}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{c.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
