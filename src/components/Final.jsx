import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { FiDownload, FiCode, FiPlayCircle } from "react-icons/fi";
import SmartStickModel from "./3d/SmartStickModel";

export default function Final() {
  return (
    <section className="relative">
      <div className="relative h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 1.2, 4.5], fov: 38 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <spotLight position={[3, 5, 3]} angle={0.3} intensity={1.6} color="#00d4ff" />
              <Sparkles count={100} scale={6} size={1.8} speed={0.25} color="#00d4ff" opacity={0.4} />
              <SmartStickModel activeComponent={null} onSelect={() => {}} autoRotate />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
        <div className="relative z-10 text-center px-6 pointer-events-none">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-display text-2xl md:text-4xl font-semibold glow-text max-w-2xl mx-auto"
          >
            Smart Blind Stick with Real-Time AI Voice Navigation
          </motion.h2>
        </div>
      </div>

      <div className="py-28 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="font-mono text-xs tracking-[0.25em] text-cyanGlow/70 uppercase mb-4">End of Presentation</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold glow-text mb-12">Thank You</h2>

          <div className="max-w-md mx-auto glass rounded-2xl p-8 mb-10 text-left">
            <div className="mb-5">
              <div className="text-[11px] font-mono uppercase tracking-widest text-cyanGlow/70 mb-1">Developed By</div>
              <div className="text-base">[ Your Name ]</div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-cyanGlow/70 mb-1">Guide</div>
              <div className="text-base">[ Guide Name ]</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button className="px-5 py-2.5 rounded-full bg-cyanGlow text-black text-sm font-semibold flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-shadow">
              <FiDownload size={15} /> Documentation
            </button>
            <button className="px-5 py-2.5 rounded-full glass text-sm font-semibold flex items-center gap-2 hover:border-cyanGlow/50 transition-colors">
              <FiCode size={15} /> GitHub
            </button>
            <button className="px-5 py-2.5 rounded-full glass text-sm font-semibold flex items-center gap-2 hover:border-cyanGlow/50 transition-colors">
              <FiPlayCircle size={15} /> Presentation
            </button>
          </div>

          <div className="mt-16 text-xs font-mono" style={{ color: "var(--text-muted)" }}>[ College Logo ]</div>
        </motion.div>
      </div>
    </section>
  );
}
