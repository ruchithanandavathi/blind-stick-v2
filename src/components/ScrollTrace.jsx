import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollTrace() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[3px] z-40 hidden md:block">
      <div className="absolute inset-0 bg-cyanGlow/5" />
      <motion.div style={{ scaleY, transformOrigin: "top" }} className="absolute inset-0 trace-line" />
    </div>
  );
}
