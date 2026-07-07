"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { story, contact } from "./data";

type Slide =
  | { kind: "statement"; text: string }
  | { kind: "contact" };

const slides: Slide[] = [
  ...story.map((text) => ({ kind: "statement" as const, text })),
  { kind: "contact" as const },
];

const variants = {
  enter: (dir: number) => ({ opacity: 0, y: dir >= 0 ? 44 : -44 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir >= 0 ? -44 : 44 }),
};

export function Pager() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const indexRef = useRef(0);
  const locked = useRef(false);

  const go = useCallback((target: number) => {
    if (locked.current) return;
    if (target < 0 || target >= slides.length) return;
    if (target === indexRef.current) return;
    locked.current = true;
    setDir(target > indexRef.current ? 1 : -1);
    indexRef.current = target;
    setIndex(target);
    window.setTimeout(() => {
      locked.current = false;
    }, 1150);
  }, []);

  const next = useCallback(() => go(indexRef.current + 1), [go]);
  const prev = useCallback(() => go(indexRef.current - 1), [go]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 12) return;
      if (e.deltaY > 0) next();
      else prev();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      }
    };
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = startY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 45) return;
      if (delta > 0) next();
      else prev();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev]);

  const current = slides[index];

  return (
    <div className="stage">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={index}
          className="slide"
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {current.kind === "statement" ? (
            <p className="statement">{current.text}</p>
          ) : (
            <div className="contact">
              <p className="label">Get in touch.</p>
              <div className="links">
                <a href={`mailto:${contact.email}`}>Email</a>
                <a href={contact.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={contact.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* progress dots */}
      <nav className="dots" aria-label="Sections">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot${i === index ? " on" : ""}`}
            aria-label={`Go to section ${i + 1}`}
            onClick={() => go(i)}
          />
        ))}
      </nav>

      {/* scroll hint, only on first slide */}
      <AnimatePresence>
        {index === 0 && (
          <motion.span
            className="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            scroll ↓
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
