import { useEffect, useRef } from "react";

export default function BackgroundField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || window.matchMedia("(max-width: 640px)").matches) return;

    let raf = 0;
    let lastTime = performance.now();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let x = 0;
    let y = 0;
    let vx = 0.96;
    let vy = -0.12;
    const beamLength = 1200;
    const beamSpeed = 0.24;

    const normalize = (nextX: number, nextY: number) => {
      const magnitude = Math.hypot(nextX, nextY) || 1;
      return { x: (nextX / magnitude) * beamSpeed, y: (nextY / magnitude) * beamSpeed };
    };

    const randomizeAfterBounce = (nextX: number, nextY: number, edge: "horizontal" | "vertical") => {
      const reflectedX = edge === "vertical" ? -nextX : nextX;
      const reflectedY = edge === "horizontal" ? -nextY : nextY;
      const reflectedAngle = Math.atan2(reflectedY, reflectedX);
      const jitter = (Math.random() - 0.5) * 0.34;
      return normalize(Math.cos(reflectedAngle + jitter), Math.sin(reflectedAngle + jitter));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      x = width * 0.34;
      y = height * 0.52;
      const initial = normalize(0.78, -0.22);
      vx = initial.x;
      vy = initial.y;
    };

    const drawBeam = () => {
      const magnitude = Math.hypot(vx, vy) || 1;
      const directionX = vx / magnitude;
      const directionY = vy / magnitude;
      const tailX = x - directionX * beamLength;
      const tailY = y - directionY * beamLength;

      context.save();
      const halo = context.createLinearGradient(tailX, tailY, x, y);
      halo.addColorStop(0, "rgba(175, 185, 200, 0)");
      halo.addColorStop(0.68, "rgba(135, 148, 168, 0.28)");
      halo.addColorStop(1, "rgba(255, 255, 255, 0.98)");
      context.strokeStyle = halo;
      context.lineWidth = 2.8;
      context.lineCap = "round";
      context.shadowColor = "rgba(255, 255, 255, 0.9)";
      context.shadowBlur = 20;
      context.beginPath();
      context.moveTo(tailX, tailY);
      context.lineTo(x, y);
      context.stroke();

      const core = context.createLinearGradient(tailX, tailY, x, y);
      core.addColorStop(0, "rgba(255, 255, 255, 0)");
      core.addColorStop(0.72, "rgba(255, 255, 255, 0.36)");
      core.addColorStop(1, "rgba(255, 255, 255, 1)");
      context.strokeStyle = core;
      context.lineWidth = 0.9;
      context.shadowBlur = 7;
      context.beginPath();
      context.moveTo(tailX, tailY);
      context.lineTo(x, y);
      context.stroke();
      context.restore();
    };

    const draw = (now: number) => {
      const elapsed = Math.min(now - lastTime, 40);
      lastTime = now;
      context.clearRect(0, 0, width, height);

      x += vx * elapsed;
      y += vy * elapsed;

      const hitLeft = x <= -beamLength * 0.08;
      const hitRight = x >= width + beamLength * 0.08;
      const hitTop = y <= -beamLength * 0.08;
      const hitBottom = y >= height + beamLength * 0.08;

      if (hitLeft || hitRight) {
        x = hitLeft ? -beamLength * 0.08 : width + beamLength * 0.08;
        const next = randomizeAfterBounce(vx, vy, "vertical");
        vx = next.x;
        vy = next.y;
      }
      if (hitTop || hitBottom) {
        y = hitTop ? -beamLength * 0.08 : height + beamLength * 0.08;
        const next = randomizeAfterBounce(vx, vy, "horizontal");
        vx = next.x;
        vy = next.y;
      }

      drawBeam();
      raf = window.requestAnimationFrame(draw);
    };

    resize();
    raf = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="background-field" aria-hidden="true" />;
}
