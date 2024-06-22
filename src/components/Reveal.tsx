import { motion, useAnimation, useInView } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

type RevealProps = {
  children: ReactNode;
  duration?: number;
  delay?: number;
  from?: "top" | "bottom" | "left" | "right";
  width?: "100%" | "fit-content";
  cover?: boolean;
  coverFrom?: "top" | "bottom" | "left" | "right";
  coverColor?: string;
  coverDuration?: number;
  coverDelay?: number;
  style?: Record<string, string | number>;
  className?: string;
};

export default function Reveal({
  children,
  duration = 0.5,
  delay = 0.25,
  from = "bottom",
  width = "fit-content",
  cover = false,
  coverFrom = "left",
  coverColor = "var(--accent)",
  coverDuration = 0.3,
  coverDelay = 0,
  style = {},
  className = "",
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView]);

  function computeFrom() {
    switch (from) {
      case "top":
        return { y: -75, opacity: 0 };
      case "bottom":
        return { y: 75, opacity: 0 };
      case "left":
        return { x: -75, opacity: 0 };
      case "right":
        return { x: 75, opacity: 0 };
    }
  }

  function computeCoverFrom() {
    switch (coverFrom) {
      case "top":
        return { top: "100%" };
      case "bottom":
        return { bottom: "100%" };
      case "left":
        return { left: "100%" };
      case "right":
        return { right: "100%" };
    }
  }

  return (
    <div
      ref={ref}
      style={{ position: "relative", width, overflow: "hidden", ...style }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: computeFrom(),
          visible: { opacity: 1, x: 0, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay }}
      >
        {children}
      </motion.div>
      {cover && (
        <motion.div
          variants={{
            hidden: { inset: 0 },
            visible: computeCoverFrom(),
          }}
          initial="hidden"
          animate={slideControls}
          transition={{
            duration: coverDuration,
            delay: coverDelay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: 0,
            right: 0,
            backgroundColor: coverColor,
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}
