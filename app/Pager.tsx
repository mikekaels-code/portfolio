"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { story, partnerRows, contact } from "./data";

// Turn [[phrase]] markers into black-highlight spans.
function withMarks(text: string) {
  return text.split(/(\[\[.+?\]\])/g).map((part, i) => {
    const m = part.match(/^\[\[(.+?)\]\]$/);
    return m ? (
      <span className="mark" key={i}>
        {m[1]}
      </span>
    ) : (
      part
    );
  });
}

type Slide =
  | { kind: "statement"; text: string; logos?: boolean }
  | { kind: "contact" };

const slides: Slide[] = [
  ...story.map((s) => ({
    kind: "statement" as const,
    text: s.text,
    logos: s.logos,
  })),
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
  const locked = useRef(true); // locked during the intro title card

  // release input once the intro has wiped away
  useEffect(() => {
    const t = setTimeout(() => {
      locked.current = false;
    }, 2600);
    return () => clearTimeout(t);
  }, []);

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
            <div className="statement-wrap">
              <p className="statement">{withMarks(current.text)}</p>
              {current.logos && (
                <div className="logo-rows">
                  {partnerRows.map((row, r) => (
                    <div className="logos" key={r}>
                      {row.map((p) => (
                        <a
                          key={p.name}
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                          className="logo-link"
                          aria-label={`${p.name} on LinkedIn`}
                          title={p.name}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.src}
                            alt={p.name}
                            className="logo"
                            style={
                              {
                                "--logo-scale": p.scale ?? 1,
                              } as React.CSSProperties
                            }
                          />
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="contact">
              <p className="label">
                Get in <span className="mark">touch</span>
              </p>
              <div className="links">
                <a href={`mailto:${contact.email}`}>Email</a>
                <a href={contact.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={contact.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={contact.medium} target="_blank" rel="noreferrer">
                  Medium
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
