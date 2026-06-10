import { motion } from "framer-motion";

export const AIOrb = ({ size = 96 }: { size?: number }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    {/* Outer halo */}
    <div
      className="absolute rounded-full opacity-60 blur-2xl"
      style={{
        inset: -size * 0.25,
        background:
          "conic-gradient(from 0deg, hsl(var(--cyan)/0.7), hsl(var(--blue)/0.7), hsl(var(--violet)/0.7), hsl(var(--fuchsia)/0.7), hsl(var(--cyan)/0.7))",
      }}
    />
    {/* Rotating conic ring */}
    <motion.div
      className="absolute inset-0 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      style={{
        background:
          "conic-gradient(from 0deg, hsl(var(--cyan)), hsl(var(--blue)), hsl(var(--violet)), hsl(var(--fuchsia)), hsl(var(--cyan)))",
        WebkitMask: "radial-gradient(circle, transparent 58%, #000 60%)",
        mask: "radial-gradient(circle, transparent 58%, #000 60%)",
      }}
    />
    {/* Core orb */}
    <motion.div
      className="absolute inset-[12%] rounded-full orb"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Inner highlight */}
    <div
      className="absolute rounded-full bg-white/40 blur-md"
      style={{ width: size * 0.22, height: size * 0.18, top: size * 0.22, left: size * 0.28 }}
    />
  </div>
);
