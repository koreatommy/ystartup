"use client";

import { useEffect, useRef } from "react";

/** 페이지 최초 로딩 시 한 번 축포 효과를 재생합니다. */
export function PageLoadConfetti() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current || typeof window === "undefined") return;
    hasFired.current = true;

    const fire = async () => {
      const confetti = (await import("canvas-confetti")).default;
      const duration = 2_000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };

      frame();
    };

    const t = setTimeout(fire, 300);
    return () => clearTimeout(t);
  }, []);

  return null;
}
