"use client";

import { useEffect, useMemo, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

// Initialise the engine once across the whole app.
let enginePromise: Promise<void> | null = null;

/**
 * Constellation field — drifting nodes linked by hairlines that react to the
 * cursor (grab on hover, push on click). Tuned to the zinc/ochre palette.
 * Sits behind the hero; degrades to a static layer under reduced-motion.
 */
export function ParticlesBg({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // engine never inits → static layer stays

    enginePromise ??= initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });

    let cancelled = false;
    enginePromise.then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 60,
      detectRetina: true,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          grab: { distance: 170, links: { opacity: 0.55, color: "#eab308" } },
          push: { quantity: 2 },
        },
      },
      particles: {
        color: { value: "#71717a" },
        links: {
          enable: true,
          distance: 145,
          color: "#3f3f46",
          opacity: 0.35,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.55,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
        number: { value: 60 },
        opacity: { value: { min: 0.2, max: 0.5 } },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 2.6 } },
      },
    }),
    [],
  );

  if (!ready) {
    // Static, motionless layer (no canvas) — covers SSR + reduced-motion.
    return <div className={className} aria-hidden />;
  }

  return (
    <Particles
      id="hero-particles"
      options={options}
      className={className}
      aria-hidden
    />
  );
}
