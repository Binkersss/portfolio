import React, { useRef, useEffect } from 'react';

// ParticleCODEButton.tsx
// Render a big "CODE" word using many small characters. This version measures the
// visible "CODE" span and renders an offscreen canvas at that exact size to
// generate particle targets that align precisely with the displayed font size.

type Props = {
  onClick?: () => void;
};

export default function ParticleCODEButton({ onClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const c = canvas as HTMLCanvasElement;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const ctx2 = ctx as CanvasRenderingContext2D;

    let w = 0;
    let h = 0;
    let animationId: number | null = null;
    const chars = ['•', '◦', '·', '*', 'x', 'o', '+'];

    // Particle class (typed)
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      tx: number;
      ty: number;
      ch: string;
      size: number;
      recentImpulse: number;

      constructor(x: number, y: number, tx: number, ty: number, ch: string) {
        this.x = x + (Math.random() - 0.5) * 40;
        this.y = y + (Math.random() - 0.5) * 40;
        // slightly higher initial velocity for snappier motion
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.tx = tx;
        this.ty = ty;
        this.ch = ch;
        this.size = 12; // visual size for tiny glyphs
        this.recentImpulse = 0;
      }
      update(mouse: { x: number | null; y: number | null }) {
        const dx = this.tx - this.x;
        const dy = this.ty - this.y;
        const distT = Math.sqrt(dx * dx + dy * dy) || 1;

        const basePull = 0.2;

        // If cursor present, apply a strong impulse toward the cursor and record its magnitude
        if (mouse.x !== null && mouse.y !== null) {
          const mx = mouse.x - this.x;
          const my = mouse.y - this.y;
          const md = Math.sqrt(mx * mx + my * my) || 1;
          const strength = Math.min(120, md);
          const attractStrength = 8000 / (strength * strength);
          const attractMul = 0.25;
          const impulseX = (mx / md) * attractStrength * attractMul;
          const impulseY = (my / md) * attractStrength * attractMul;
          this.vx += impulseX;
          this.vy += impulseY;
          const mag = Math.sqrt(impulseX * impulseX + impulseY * impulseY) || 0;
          // retain a decaying recent impulse so return can match outgoing speed
          this.recentImpulse = Math.max(this.recentImpulse * 0.9, mag);
        }

        // If the cursor is not present, boost pull back to target proportional to recent impulse
        let effectivePull = basePull;
        if (mouse.x === null || mouse.y === null) {
          effectivePull += this.recentImpulse * 0.9;
        }

        this.vx += (dx / distT) * effectivePull;
        this.vy += (dy / distT) * effectivePull;

        // decay recent impulse over time
        this.recentImpulse *= 0.92;

        // lower damping for snappier, more energetic motion
        this.vx *= 0.75;
        this.vy *= 0.75;

        this.x += this.vx;
        this.y += this.vy;

        this.x += (Math.random() - 0.5) * 0.2;
        this.y += (Math.random() - 0.5) * 0.2;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.font = `${this.size}px Inter, ui-sans-serif, system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.ch, this.x, this.y);
      }
    }

    let particles: Particle[] = [];
    const mouse: { x: number | null; y: number | null } = { x: null, y: null };

    function buildParticles() {
      const off = document.createElement('canvas');
      const offCtx = off.getContext('2d');
      if (!offCtx) return;

      // If the visible text element is available, measure it and render offscreen
      // at the same size so particle targets align with the displayed glyphs.
      const textEl = textRef.current;
      const containerEl = containerRef.current;
      if (textEl && containerEl) {
        const tr = textEl.getBoundingClientRect();
        const cr = containerEl.getBoundingClientRect();
        const localLeft = Math.max(0, Math.floor(tr.left - cr.left));
        const localTop = Math.max(0, Math.floor(tr.top - cr.top));
        const textW = Math.max(20, Math.floor(tr.width));
        const textH = Math.max(10, Math.floor(tr.height));

        off.width = textW;
        off.height = textH;

        const style = getComputedStyle(textEl);
        const fontSize = parseFloat(style.fontSize) || textH;

        offCtx.clearRect(0, 0, off.width, off.height);
        offCtx.fillStyle = 'white';
        offCtx.font = `${style.fontWeight || '700'} ${fontSize}px ${style.fontFamily || 'Inter, ui-sans-serif, system-ui'}`;
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText('CODE', off.width / 2, off.height / 2 + fontSize * 0.06);

        const img = offCtx.getImageData(0, 0, off.width, off.height).data;
        particles = [];
        // increase the sampling gap to lower density; tweak these numbers to taste
        const gap = Math.max(6, Math.floor(fontSize / 8));

        for (let yy = 0; yy < off.height; yy += gap) {
          for (let xx = 0; xx < off.width; xx += gap) {
            const idx = (yy * off.width + xx) * 4;
            if (img[idx + 3] > 128) {
              const targetX = localLeft + xx;
              const targetY = localTop + yy;
              const ch = chars[Math.floor(Math.random() * chars.length)];
              particles.push(new Particle(targetX, targetY, targetX, targetY, ch));
            }
          }
        }
        // cap particle count to a reasonable maximum and down-sample if needed
        const MAX_PARTICLES = 1000;
        if (particles.length > MAX_PARTICLES) {
          const step = Math.ceil(particles.length / MAX_PARTICLES);
          const reduced: Particle[] = [];
          for (let i = 0; i < particles.length; i += step) reduced.push(particles[i]);
          particles = reduced;
        }
        return;
      }

      // fallback: approximate using container dimensions
      off.width = Math.max(600, w);
      off.height = Math.max(220, h / 2);
      const fallbackFontSize = Math.floor(off.height * 0.8);
      offCtx.clearRect(0, 0, off.width, off.height);
      offCtx.fillStyle = 'white';
      offCtx.font = `bold ${fallbackFontSize}px Inter, ui-sans-serif, system-ui`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText('CODE', off.width / 2, off.height / 2 + fallbackFontSize * 0.06);
      const img = offCtx.getImageData(0, 0, off.width, off.height).data;
      particles = [];
      const gap = Math.max(6, Math.floor(fallbackFontSize / 12));
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          const idx = (y * off.width + x) * 4;
          if (img[idx + 3] > 128) {
            const targetX = (x / off.width) * w;
            const targetY = (y / off.height) * (h * 0.6) + (h * 0.2);
            const ch = chars[Math.floor(Math.random() * chars.length)];
            particles.push(new Particle(targetX, targetY, targetX, targetY, ch));
          }
        }
      }
      const MAX_PARTICLES = 1000;
      if (particles.length > MAX_PARTICLES) {
        const step = Math.ceil(particles.length / MAX_PARTICLES);
        const reduced: Particle[] = [];
        for (let i = 0; i < particles.length; i += step) reduced.push(particles[i]);
        particles = reduced;
      }
    }

    function resize() {
      const rect = containerRef.current!.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
  c.width = w * devicePixelRatio;
  c.height = h * devicePixelRatio;
  c.style.width = `${w}px`;
  c.style.height = `${h}px`;
  ctx2.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      buildParticles();
    }

    function render() {
      ctx2.clearRect(0, 0, w, h);

      const grad = ctx2.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(99,102,241,0.06)');
      grad.addColorStop(1, 'rgba(139,92,246,0.03)');
      ctx2.fillStyle = grad;
      ctx2.fillRect(0, 0, w, h);

      ctx2.fillStyle = 'white';
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse);
        particles[i].draw(ctx2);
      }

      animationId = requestAnimationFrame(render);
    }

    function onMove(e: MouseEvent | TouchEvent) {
      const rect = c.getBoundingClientRect();
      const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
    }

    function onLeave() {
      mouse.x = null;
      mouse.y = null;
    }

    window.addEventListener('resize', resize);
    // listen on the container so pointer movement is captured even when buttons overlay the canvas
    const containerEl = containerRef.current as HTMLDivElement | null;
    if (containerEl) {
      containerEl.addEventListener('mousemove', onMove as EventListener);
      containerEl.addEventListener('touchmove', onMove as EventListener, { passive: true } as AddEventListenerOptions);
      containerEl.addEventListener('mouseleave', onLeave as EventListener);
      containerEl.addEventListener('touchend', onLeave as EventListener);
    }

    resize();
    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      if (containerEl) {
        containerEl.removeEventListener('mousemove', onMove as EventListener);
        containerEl.removeEventListener('touchmove', onMove as EventListener);
        containerEl.removeEventListener('mouseleave', onLeave as EventListener);
        containerEl.removeEventListener('touchend', onLeave as EventListener);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white p-8 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        aria-hidden="true"
      />

      <button
        onClick={onClick}
        className="no-underline z-10"
        aria-label="Go to code section"
        style={{ background: 'transparent', border: 'none' }}
      >
        <span className="sr-only">Go to code section</span>
        <span
          ref={textRef}
          className="cursor-pointer inline-block bg-clip-text text-transparent text-[max(3rem,6.5vw)] leading-none font-semibold"
          style={{
            backgroundImage: 'linear-gradient(90deg, rgb(56 189 248), rgb(139 92 246))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 14px rgba(0,0,0,0.4)'
          }}
        >
          CODE
        </span>
      </button>
    </div>
  );
}
