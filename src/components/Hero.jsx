import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sparkles, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import SmartStickModel from "./3d/SmartStickModel";
import * as THREE from "three";

function FloatingParticles() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.04;
  });
  const positions = new Float32Array(300 * 3);
  for (let i = 0; i < 300; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00d4ff" size={0.025} sizeAttenuation transparent opacity={0.5} />
    </points>
  );
}

export default function Hero({ onComponents }) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none grid-backdrop"
        style={{ maskImage: "radial-gradient(ellipse 80% 70% at center, black 0%, transparent 75%)" }}
      />

      {/* 3D canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 1.1, 4.4], fov: 42 }}
          shadows
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.35} />
            <spotLight position={[4, 6, 4]} angle={0.25} intensity={3} color="#00d4ff" castShadow />
            <spotLight position={[-4, 1, -4]} angle={0.35} intensity={1.2} color="#1e5fff" />
            <spotLight position={[0, -2, 3]} angle={0.5} intensity={0.5} color="#ffffff" />
            <FloatingParticles />
            <Sparkles count={80} scale={7} size={1.4} speed={0.2} color="#00d4ff" opacity={0.35} />
            <SmartStickModel
              activeComponent={null}
              onSelect={() => {}}
              autoRotate
              exploded={false}
              showWiring={false}
            />
            <Environment preset="warehouse" />
          </Suspense>
        </Canvas>
      </div>

      {/* Text overlay */}
      <div className="relative z-10 text-center px-6 pointer-events-none mt-[-6vh] max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-mono text-[11px] tracking-[0.3em] text-cyanGlow/70 mb-5 uppercase"
        >
          Final Year Engineering Project · Raspberry Pi · Real-Time AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold glow-text leading-[1.1] tracking-tight"
        >
          Smart Blind Stick
          <span className="block text-cyanGlow">with AI Voice Navigation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-6 text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          AI-powered navigation system for visually impaired people using Raspberry Pi, Computer Vision,
          GPS, GSM, Voice Assistant, and IoT — detecting real-world objects in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45 }}
          className="flex gap-4 justify-center mt-10 pointer-events-auto flex-wrap"
        >
          <button
            onClick={onComponents}
            className="px-7 py-3.5 rounded-full bg-cyanGlow text-black font-bold text-sm tracking-wide hover:shadow-[0_0_40px_rgba(0,212,255,0.55)] transition-all hover:scale-105"
          >
            Explore the Stick →
          </button>
          <Link
            to="/ai-model"
            className="px-7 py-3.5 rounded-full glass font-bold text-sm tracking-wide hover:border-cyanGlow/60 transition-all hover:scale-105"
          >
            See the AI Model
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-8 justify-center mt-12"
        >
          {[["12+", "Sensors"], ["Real-Time", "AI YOLO"], ["On-Device", "Inference"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="font-display font-bold text-lg text-cyanGlow">{v}</div>
              <div className="text-[10px] font-mono uppercase tracking-wide mt-0.5" style={{ color: "var(--text-muted)" }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 flex flex-col items-center gap-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <FiChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
