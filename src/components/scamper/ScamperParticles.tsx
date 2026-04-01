"use client";

import { useMemo } from "react";

const PARTICLE_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFEAA7",
  "#DDA0DD",
  "#96CEB4",
] as const;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

interface ScamperParticlesProps {
  /** 0이 아닐 때마다 새 파티클 묶음이 생성됩니다 */
  burstKey: number;
}

function createParticles(): Particle[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)] ?? "#4ECDC4",
    delay: Math.random() * 0.5,
  }));
}

export function ScamperParticles({ burstKey }: ScamperParticlesProps) {
  const particles = useMemo(() => {
    if (burstKey === 0) return [];
    return createParticles();
  }, [burstKey]);

  if (!particles.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999]" aria-hidden>
      {particles.map((pt) => (
        <div
          key={pt.id}
          style={{
            position: "absolute",
            left: `${pt.x}%`,
            top: `${pt.y}%`,
            width: pt.size,
            height: pt.size,
            borderRadius: "50%",
            backgroundColor: pt.color,
            animation: `scamperParticleFade 1.2s ease-out ${pt.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
