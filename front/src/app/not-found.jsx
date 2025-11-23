"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const canvasRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const dpi = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * dpi;
      canvas.height = innerHeight * dpi;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const NUM_PARTICLES = 80;
    const particles = Array.from({ length: NUM_PARTICLES }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 * dpi + 0.5 * dpi,
      a: Math.random() * Math.PI * 2,
      s: 0.3 + Math.random() * 0.7,
      h: 200 + Math.floor(Math.random() * 60),
      o: 0.25 + Math.random() * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // soft gradient background glow
      const grd = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.3,
        0,
        canvas.width * 0.5,
        canvas.height * 0.6,
        Math.max(canvas.width, canvas.height) * 0.8
      );
      grd.addColorStop(0, "rgba(59,130,246,0.12)"); // blue-500
      grd.addColorStop(1, "rgba(147,51,234,0.06)"); // purple-600
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // particles
      particles.forEach((p) => {
        p.x += Math.cos(p.a) * p.s;
        p.y += Math.sin(p.a) * p.s;
        p.a += 0.002; // subtle drift

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.h}, 90%, 65%, ${p.o})`;
        ctx.shadowColor = `hsla(${p.h}, 90%, 55%, ${p.o})`;
        ctx.shadowBlur = 12 * dpi;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-gray-950">
      {/* animated canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* gradient layers */}
      <div className="pointer-events-none absolute -inset-40 opacity-60 blur-3xl">
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500/40 to-purple-500/40 animate-float-slow" />
        <div className="absolute right-16 bottom-10 h-80 w-80 rounded-full bg-gradient-to-tr from-cyan-400/30 to-fuchsia-500/30 animate-float" />
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center text-white">
        {/* glitch 404 */}
        <div className="relative mb-6">
          <h1 className="glitch-text select-none text-7xl font-extrabold tracking-wider sm:text-8xl md:text-9xl">404</h1>
          <span className="glitch-layer glitch-layer--1">404</span>
          <span className="glitch-layer glitch-layer--2">404</span>
        </div>

        <p className="mb-8 text-lg text-blue-100/90 sm:text-xl">
          صفحه‌ای که به دنبالش هستید پیدا نشد یا جابه‌جا شده است.
        </p>

        {/* action */}
        <div className="mt-2">
          <button
            onClick={() => router.back()}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            بازگشت
          </button>
        </div>

        {/* hint */}
        <div className="mt-10 text-sm text-blue-100/60">
          اگر فکر می‌کنید این خطا اشتباه است، آدرس را بررسی کنید یا به یکی از صفحه‌های بالا بروید.
        </div>
      </div>

      {/* decorative lines */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-white to-transparent animate-scan" />
        <div className="absolute left-0 top-2/3 h-px w-full bg-gradient-to-r from-transparent via-white to-transparent animate-scan delay-700" />
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-slow {
          0% { transform: translate(-50%, 0px); }
          50% { transform: translate(-50%, -10px); }
          100% { transform: translate(-50%, 0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }

        @keyframes scan {
          0% { transform: translateX(-30%); opacity: 0.0; }
          50% { transform: translateX(0%); opacity: 1; }
          100% { transform: translateX(30%); opacity: 0.0; }
        }
        .animate-scan { animation: scan 4s linear infinite; }

        /* glitch */
        .glitch-text { position: relative; text-shadow: 0 0 12px rgba(59,130,246,0.6); }
        .glitch-layer { position: absolute; top: 0; left: 50%; transform: translateX(-50%); color: #fff; opacity: 0.6; filter: blur(0.5px); pointer-events: none; }
        .glitch-layer--1 { animation: glitch 2.2s infinite; color: rgba(59,130,246,0.8); }
        .glitch-layer--2 { animation: glitch 2.2s infinite 0.3s; color: rgba(168,85,247,0.8); }
        @keyframes glitch {
          0% { clip-path: inset(0 0 85% 0); transform: translate(-50%, 0); }
          20% { clip-path: inset(10% 0 60% 0); transform: translate(calc(-50% + 2px), -1px); }
          40% { clip-path: inset(35% 0 30% 0); transform: translate(calc(-50% - 1px), 1px); }
          60% { clip-path: inset(60% 0 10% 0); transform: translate(calc(-50% + 1px), 0); }
          80% { clip-path: inset(80% 0 0 0); transform: translate(calc(-50% - 2px), 1px); }
          100% { clip-path: inset(0 0 85% 0); transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}


