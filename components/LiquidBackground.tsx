"use client";

import { useEffect, useRef } from "react";

/**
 * LiquidBackground
 * ----------------
 * A dependency-free WebGL fragment shader that renders a slow, flowing
 * "liquid glass" field — domain-warped fractal noise that drifts on its own
 * and bends toward the cursor with smoothed (lerp'd) parallax.
 *
 * Tweak the look via the `palette` prop. Colors are linear-ish 0–1 RGB.
 * Defaults lean dark + faintly warm so it reads as molten glass while
 * staying on-brand with the achromatic system and keeping overlaid type
 * readable.
 */

type RGB = [number, number, number];

interface Palette {
  /** Deepest shadow color (the "ink") */
  base: RGB;
  /** Mid flow color */
  mid: RGB;
  /** Specular sheen / highlight color */
  sheen: RGB;
}

const DARK_PALETTE: Palette = {
  base: [0.012, 0.018, 0.03], // deep cool ink
  mid: [0.1, 0.13, 0.18], // cool slate so the blue glint reads as glass
  sheen: [0.678, 0.875, 1.0], // #ADDFFF — icy blue glint
};

const LIGHT_PALETTE: Palette = {
  base: [0.95, 0.96, 1.0], // near-white pane
  mid: [0.42, 0.58, 0.85], // deeper blue folds → harsher contrast on white
  sheen: [0.4, 0.66, 1.0], // bright blue glint
};

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;   // smoothed mouse in [0,1], y up
uniform vec3  u_base;
uniform vec3  u_mid;
uniform vec3  u_sheen;

// --- value noise -----------------------------------------------------------
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  // few octaves → large cohesive folds instead of fine smoke
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p = rot * p * 2.0 + 11.3;
    amp *= 0.45;
  }
  return v;
}

void main() {
  // aspect-corrected coords centered at 0
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  float t = u_time * 0.045;

  // cursor offset — gentle parallax pull
  vec2 m = (u_mouse - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  uv += m * 0.18;

  // --- domain warping (Inigo Quilez style) -------------------------------
  // low frequency → large, cohesive folds
  vec2 q;
  q.x = fbm(uv * 1.0 + vec2(0.0, t));
  q.y = fbm(uv * 1.0 + vec2(5.2, 1.3 - t));

  vec2 r;
  r.x = fbm(uv * 1.0 + 2.0 * q + vec2(1.7 - t * 0.7, 9.2));
  r.y = fbm(uv * 1.0 + 2.0 * q + vec2(8.3, 2.8 + t * 0.6));

  float f = fbm(uv * 1.0 + 3.0 * r);

  // base flow color — NARROW transition band centered near the noise median
  // → harsh, defined fold edges with balanced light/dark (not washed, not too
  // dark). this band width is the main "harshness" dial.
  vec3 col = mix(u_base, u_mid, smoothstep(0.36, 0.5, f));
  col = mix(col, u_mid * 1.5, smoothstep(0.6, 1.05, length(q)));

  // sharp sheen riding the folds — crisp, brighter streaks
  float band = smoothstep(0.58, 0.8, r.x) * smoothstep(0.95, 0.55, r.y);
  float spec = pow(band, 2.0);
  spec += pow(smoothstep(0.8, 1.0, f), 4.0) * 0.6; // tight bright crests
  col += u_sheen * spec * 1.1;

  // crisp caustic streaks where the fold turns over — appear occasionally as
  // the threshold sweeps across the moving field.
  float rim = smoothstep(0.022, 0.0, abs(r.x - 0.72));
  col += u_sheen * rim * 0.7;

  // soft specular hotspot that follows the cursor
  float glow = smoothstep(0.6, 0.0, length(uv - m * 0.6));
  col += u_sheen * glow * 0.07;

  // radial vignette to seat the type
  float vig = smoothstep(1.3, 0.2, length(uv));
  col *= 0.45 + 0.55 * vig;

  // whisper of grain — just enough to kill banding, not enough to read as smoke
  float grain = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.008;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function LiquidBackground({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { antialias: true, alpha: false }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // --- program ---------------------------------------------------------
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uBase = gl.getUniformLocation(prog, "u_base");
    const uMid = gl.getUniformLocation(prog, "u_mid");
    const uSheen = gl.getUniformLocation(prog, "u_sheen");

    // Palette follows the theme, and updates live when it's toggled
    const applyPalette = () => {
      const p = document.documentElement.classList.contains("light")
        ? LIGHT_PALETTE
        : DARK_PALETTE;
      gl.uniform3fv(uBase, p.base);
      gl.uniform3fv(uMid, p.mid);
      gl.uniform3fv(uSheen, p.sheen);
    };
    applyPalette();
    const themeObserver = new MutationObserver(applyPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // --- sizing ----------------------------------------------------------
    // The field is soft, so we render below native resolution — a big GPU
    // saving on this heavy fragment shader with no visible quality loss.
    const RENDER_SCALE = 0.75;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * RENDER_SCALE;
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // --- mouse with smoothing -------------------------------------------
    const target = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    // --- render loop -----------------------------------------------------
    // Only runs while the hero is on-screen and the tab is visible, so the
    // shader stops eating GPU once the user scrolls away.
    let raf = 0;
    let running = false;
    let onScreen = true;
    let last = performance.now();
    let elapsed = 0;

    const render = (now: number) => {
      elapsed += now - last;
      last = now;

      smooth.x += (target.x - smooth.x) * 0.04;
      smooth.y += (target.y - smooth.y) * 0.04;

      gl.uniform1f(uTime, reduceMotion ? 0 : elapsed / 1000);
      gl.uniform2f(uMouse, smooth.x, smooth.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (running || !onScreen || document.hidden) return;
      running = true;
      last = performance.now(); // resume cleanly, no time jump
      raf = requestAnimationFrame(render);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Pause when the hero scrolls out of view
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        onScreen ? startLoop() : stopLoop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    // Pause when the tab is hidden
    const onVisibility = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener("visibilitychange", onVisibility);

    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
