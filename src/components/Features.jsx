import { motion } from "framer-motion";
import {
  FiRadio, FiMapPin, FiVolume2, FiAlertTriangle, FiDroplet, FiSun, FiEye, FiMic, FiWifiOff, FiBatteryCharging, FiNavigation,
} from "react-icons/fi";

const FEATURES = [
  { icon: FiEye, label: "Real-Time AI Object Detection" },
  { icon: FiVolume2, label: "Voice Assistant" },
  { icon: FiMapPin, label: "GPS Navigation" },
  { icon: FiRadio, label: "Obstacle Detection" },
  { icon: FiAlertTriangle, label: "SOS Emergency" },
  { icon: FiNavigation, label: "Live Location Sharing" },
  { icon: FiDroplet, label: "Water Detection" },
  { icon: FiSun, label: "Solar Charging" },
  { icon: FiBatteryCharging, label: "Battery Monitoring" },
  { icon: FiMic, label: "Voice Commands" },
  { icon: FiWifiOff, label: "Offline AI Detection" },
];

export default function Features() {
  return (
    <section className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-3">09 — Project Features</div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold">Everything Built Into One System</h2>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURES.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
            whileHover={{ y: -4 }}
            className="glass rounded-xl p-5 flex flex-col items-center text-center gap-3 hover:border-cyanGlow/40 transition-colors"
          >
            <Icon className="text-cyanGlow" size={22} />
            <span className="text-xs font-medium">{label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
