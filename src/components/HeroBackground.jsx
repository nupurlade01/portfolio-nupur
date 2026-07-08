import React, { useRef, useEffect } from 'react';

const HeroBackground = () => {
  const BLUE = '96,165,250';
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let W = 0;
    let H = 0;
    let isMobile = false;

    // Grid data structures
    let staticHexes = [];
    let pulsingHexes = [];
    let filledHexes = [];
    let particles = [];
    let bgCanvas = null;

    const drawHexagon = (context, x, y, r) => {
      context.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30);
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) {
          context.moveTo(px, py);
        } else {
          context.lineTo(px, py);
        }
      }
      context.closePath();
    };

    const initGrid = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;

      // Adjust to device pixel ratio for sharp canvas rendering
      canvas.width = W;
      canvas.height = H;

      isMobile = window.innerWidth < 768;
      const R = isMobile ? 22 : 28;
      const particleCount = isMobile ? 15 : 30;

      // Spacing for pointy-topped hexagon grid
      const dxSpacing = Math.sqrt(3) * R;
      const dySpacing = 1.5 * R;

      const cols = Math.ceil(W / dxSpacing) + 1;
      const rows = Math.ceil(H / dySpacing) + 1;

      staticHexes = [];
      pulsingHexes = [];
      filledHexes = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * dxSpacing + (r % 2 === 1 ? dxSpacing / 2 : 0);
          const y = r * dySpacing;

          const rand = Math.random();
          const phase = Math.random() * Math.PI * 2;

          if (rand < 0.18) {
            // Pulsing hex (stroke pulses)
            pulsingHexes.push({
              x,
              y,
              phase,
              speed: Math.random() * (0.007 - 0.003) + 0.003
            });
          } else if (rand < 0.23) {
            // Filled hex (slow fill oscillation)
            filledHexes.push({
              x,
              y,
              phase,
              speed: Math.random() * (0.003 - 0.001) + 0.001
            });
          } else {
            // Static hex
            staticHexes.push({ x, y });
          }
        }
      }

      // Pre-render static hex grid to offscreen canvas
      bgCanvas = document.createElement('canvas');
      bgCanvas.width = W;
      bgCanvas.height = H;
      const bgCtx = bgCanvas.getContext('2d');
      if (bgCtx) {
        bgCtx.strokeStyle = `rgba(${BLUE}, 0.055)`;
        bgCtx.lineWidth = 0.8;
        
        // Draw static hexagons
        staticHexes.forEach((hex) => {
          drawHexagon(bgCtx, hex.x, hex.y, R);
          bgCtx.stroke();
        });

        // Also draw initial stroke boundaries for filled hexagons
        filledHexes.forEach((hex) => {
          drawHexagon(bgCtx, hex.x, hex.y, R);
          bgCtx.stroke();
        });
      }

      // Initialize particles
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.5 + 1.0, // 1 to 2.5px
          vx: Math.random() * 0.3 - 0.15, // ±0.15px/frame
          vy: -(Math.random() * 0.5 + 0.2), // -0.2 to -0.7px/frame
          alpha: Math.random() * 0.5 + 0.3 // 0.3 to 0.8
        });
      }
    };

    const handleResize = () => {
      initGrid();
    };

    // Initialize layout
    initGrid();
    window.addEventListener('resize', handleResize);

    // Mouse events attached to parent element to bypass pointer-events: none on canvas
    const parent = canvas.parentElement;
    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -999;
      mouseRef.current.y = -999;
    };

    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Loop
    const tick = () => {
      const t = Date.now();
      const R = isMobile ? 22 : 28;

      ctx.clearRect(0, 0, W, H);

      // 1. Draw static grid background from offscreen canvas
      if (bgCanvas) {
        ctx.drawImage(bgCanvas, 0, 0);
      }

      // 2. Draw dynamically filled hexagons
      filledHexes.forEach((hex) => {
        const fillA = 0.03 + 0.04 * Math.sin(t * hex.speed * 0.5 + hex.phase);
        ctx.fillStyle = `rgba(${BLUE}, ${fillA})`;
        drawHexagon(ctx, hex.x, hex.y, R);
        ctx.fill();
      });

      // 3. Draw dynamically pulsing hexagons
      pulsingHexes.forEach((hex) => {
        const strokeA = 0.04 + 0.14 * (0.5 + 0.5 * Math.sin(t * hex.speed + hex.phase));
        ctx.strokeStyle = `rgba(${BLUE}, ${strokeA})`;
        ctx.lineWidth = 0.8;
        drawHexagon(ctx, hex.x, hex.y, R);
        ctx.stroke();
      });

      // 4. Update and draw floating particles
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Apply mouse repel if not on mobile
        if (!isMobile && mouseRef.current.x !== -999) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120 && dist > 0) {
            const force = ((120 - dist) / 120) * 1.2;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Boundary wrap
        if (p.y < -5) {
          p.y = H + 5;
          p.x = Math.random() * W;
        }
        if (p.x < -5) {
          p.x = W + 5;
        } else if (p.x > W + 5) {
          p.x = -5;
        }

        // Draw particle outer halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BLUE}, ${p.alpha * 0.12})`;
        ctx.fill();

        // Draw particle solid core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BLUE}, ${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(tick);
    };

    // Start loop
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.85,
        pointerEvents: 'none'
      }}
    />
  );
};

export default HeroBackground;
