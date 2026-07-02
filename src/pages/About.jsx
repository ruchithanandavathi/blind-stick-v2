import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";

function Block({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-7 mb-5"
    >
      <h3 className="font-display text-xl font-semibold mb-3">{title}</h3>
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="About the Project"
        title="A Real-World Accessibility Solution"
        subtitle="What problem this solves, what makes it different, and where it can go next."
      />

      <div className="max-w-3xl mx-auto px-6 pb-28">
        <Block title="Problem Statement" delay={0}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Traditional white canes only detect what they physically touch, give no advance
            warning of obstacles like vehicles or open doors, and offer no way to call for help in
            an emergency. Visually impaired users are left to navigate unfamiliar or hazardous
            environments with very limited situational awareness.
          </p>
        </Block>

        <Block title="Objectives" delay={0.08}>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li>— Detect obstacles ahead of physical contact using AI and ultrasonic sensing</li>
            <li>— Provide real-time spoken guidance, not just alert tones</li>
            <li>— Track live location for both navigation and emergencies</li>
            <li>— Give the user a one-press way to alert family during an emergency</li>
            <li>— Keep the system usable outdoors all day via solar-assisted charging</li>
          </ul>
        </Block>

        <Block title="Innovation" delay={0.16}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Unlike most blind-stick projects that rely solely on distance sensors, this system runs
            actual real-time object recognition on-device using a Raspberry Pi and a trained YOLO
            model — identifying what an obstacle is, not just that something is there — combined
            with a natural-language voice assistant rather than fixed canned alerts.
          </p>
        </Block>

        <Block title="Real-Time Features" delay={0.24}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Object detection, GPS tracking, voice recognition, and emergency messaging all run
            concurrently on the same board, responding within seconds rather than relying on
            batch processing or a separate companion device.
          </p>
        </Block>

        <Block title="Future Scope" delay={0.32}>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li>— Indoor navigation using Bluetooth beacons or SLAM</li>
            <li>— Traffic signal color detection</li>
            <li>— Kannada and other regional language voice assistant support</li>
            <li>— Companion mobile app for family monitoring</li>
            <li>— Cloud-based usage analytics and remote model updates</li>
          </ul>
        </Block>
      </div>
    </div>
  );
}
