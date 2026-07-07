"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="intro-inner"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
          >
            <motion.span
              className="intro-name"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            >
              Mike Sihombing
            </motion.span>
            <motion.span
              className="intro-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
