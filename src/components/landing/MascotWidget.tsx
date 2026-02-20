import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence still used for cheeks

interface MascotWidgetProps {
  onClick: () => void;
}

const MascotWidget = ({ onClick }: MascotWidgetProps) => {
  const mascotRef = useRef<HTMLButtonElement>(null);
  const [eyeAngle, setEyeAngle] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;

      const rect = mascotRef.current.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - mascotCenterX;
      const dy = e.clientY - mascotCenterY;

      const distance = Math.sqrt(dx * dx + dy * dy);
      setIsNear(distance < 160);

      const angle = Math.atan2(dy, dx);
      const maxOffset = 4;
      setEyeAngle({
        x: Math.cos(angle) * maxOffset,
        y: Math.sin(angle) * maxOffset,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const Eye = () => (
    <div
      className="relative flex items-center justify-center rounded-full bg-white"
      style={{ width: 14, height: 14 }}
    >
      {/* Pupil only — no eyelid */}
      <motion.div
        animate={{ x: eyeAngle.x, y: eyeAngle.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-[7px] h-[7px] rounded-full bg-foreground"
      />
    </div>
  );

  return (
    <motion.button
      ref={mascotRef}
      onClick={onClick}
      animate={{ scale: isNear ? 1.15 : 1, y: [0, -5, 0] }}
      transition={{
        scale: { type: "spring", stiffness: 260, damping: 18 },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      }}
      whileTap={{ scale: 0.95 }}
      className="relative w-16 h-16 cursor-pointer select-none focus:outline-none"
      aria-label="Open chat"
    >
      {/* Body */}
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        {/* Shadow */}
        <ellipse cx="32" cy="62" rx="14" ry="3" fill="hsl(var(--foreground) / 0.12)" />

        {/* Body blob */}
        <path
          d="M8 36C8 20 18 10 32 10C46 10 56 20 56 36C56 50 46 60 32 60C18 60 8 50 8 36Z"
          fill="hsl(var(--primary))"
        />

        {/* Belly */}
        <ellipse cx="32" cy="44" rx="11" ry="9" fill="hsl(var(--primary-foreground) / 0.15)" />

        {/* Ears */}
        <path d="M14 20 C10 10 18 6 22 14" fill="hsl(var(--primary))" />
        <path d="M50 20 C54 10 46 6 42 14" fill="hsl(var(--primary))" />

        {/* Inner ears */}
        <path d="M16 19 C13 12 19 9 22 15" fill="hsl(var(--accent-foreground) / 0.35)" />
        <path d="M48 19 C51 12 45 9 42 15" fill="hsl(var(--accent-foreground) / 0.35)" />

        {/* Happy cheeks */}
        <AnimatePresence>
          {isNear && (
            <>
              <motion.ellipse
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                cx="20" cy="40" rx="5" ry="3"
                fill="hsl(var(--destructive) / 0.25)"
              />
              <motion.ellipse
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                cx="44" cy="40" rx="5" ry="3"
                fill="hsl(var(--destructive) / 0.25)"
              />
            </>
          )}
        </AnimatePresence>

        {/* Smile - bigger when near */}
        <motion.path
          animate={{
            d: isNear
              ? "M24 46 Q32 54 40 46"
              : "M25 46 Q32 52 39 46",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Eyes (HTML overlay for interactive pupils) */}
      <div className="absolute top-[27px] left-0 right-0 flex justify-center gap-[10px] pointer-events-none">
        <Eye />
        <Eye />
      </div>
    </motion.button>
  );
};

export default MascotWidget;
