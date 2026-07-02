import { motion } from "framer-motion";

const WIRES = [
  { label: "Camera", pin: "CSI Port", side: "left", y: 12, color: "#00d4ff" },
  { label: "Ultrasonic", pin: "GPIO 23/24", side: "left", y: 28, color: "#00d4ff" },
  { label: "Water Sensor", pin: "GPIO 17 (ADC)", side: "left", y: 44, color: "#00d4ff" },
  { label: "Microphone", pin: "USB", side: "left", y: 60, color: "#00d4ff" },
  { label: "GPS Module", pin: "UART TX/RX", side: "right", y: 12, color: "#1e5fff" },
  { label: "SIM/GSM", pin: "UART TX/RX", side: "right", y: 28, color: "#ffb340" },
  { label: "Speaker", pin: "USB / I2S", side: "right", y: 44, color: "#00d4ff" },
  { label: "Battery", pin: "5V / GND", side: "right", y: 60, color: "#3dffb0" },
  { label: "Solar Panel", pin: "Charge Controller", side: "right", y: 76, color: "#3dffb0" },
];

export default function PinDiagram() {
  return (
    <section className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-3">07 — Complete Pin Connections</div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold">Raspberry Pi GPIO Map</h2>
        <p className="mt-3 max-w-lg mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
          Every sensor and module wired into the central board.
        </p>
      </div>

      <div className="max-w-3xl mx-auto glass rounded-2xl p-8 relative overflow-hidden">
        <svg viewBox="0 0 100 90" className="w-full h-[420px]">
          <rect x="38" y="30" width="24" height="30" rx="2" fill="var(--bg-elevated)" stroke="#00d4ff" strokeOpacity="0.4" strokeWidth="0.5" />
          <text x="50" y="47" textAnchor="middle" fontSize="3.2" fill="#00d4ff" fontFamily="monospace">Raspberry Pi</text>

          {WIRES.map((w, i) => {
            const startX = w.side === "left" ? 38 : 62;
            const endX = w.side === "left" ? 5 : 95;
            return (
              <g key={w.label}>
                <motion.path
                  d={`M ${startX} 45 Q ${(startX + endX) / 2} ${w.y} ${endX} ${w.y}`}
                  fill="none"
                  stroke={w.color}
                  strokeWidth="0.5"
                  strokeDasharray="2 1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.8 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.08 }}
                />
                <motion.circle
                  cx={endX} cy={w.y} r="1"
                  fill={w.color}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.6 }}
                />
                <text
                  x={w.side === "left" ? endX + 2 : endX - 2}
                  y={w.y - 1.5}
                  textAnchor={w.side === "left" ? "start" : "end"}
                  fontSize="2.6"
                  fill="var(--text)"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {w.label}
                </text>
                <text
                  x={w.side === "left" ? endX + 2 : endX - 2}
                  y={w.y + 2.2}
                  textAnchor={w.side === "left" ? "start" : "end"}
                  fontSize="2"
                  fill={w.color}
                  fontFamily="monospace"
                >
                  {w.pin}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
