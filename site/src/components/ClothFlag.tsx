import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Variante da Avanti do Cloth Banner do MyUI (components/myui/cloth-banner): igual ao original,
 * mais duas opções: `letter` (cor das letras/logo, em vez da cor do fundo) e logos largos
 * (`logoW` x `logoH`, desenhado ocupando `logoWidth` da largura do pano).
 *
 * Um banner de aviso feito de tecido, pendurado num varão. O pano é simulado de verdade
 * (uma malha de pontos ligados, com gravidade e vento) e desenhado em WebGL com luz nas
 * dobras. Ao aparecer na tela, ele cai do varão e se desenrola balançando; passe o mouse
 * rápido e ele ondula com o vento que você faz; agarre em qualquer ponto e puxe. Saindo da
 * tela, ele se solta do varão e cai. O pano tem a cor do texto e as letras a cor do fundo.
 */

export interface ClothBannerProps {
  /** Cor das letras e do logo. Padrão: a cor do fundo da página. */
  letter?: string;
  /** Logo largo: largura e altura do viewBox. */
  logoW?: number;
  logoH?: number;
  /** Fração da largura do pano que o logo ocupa. */
  logoWidth?: number;
  /** O texto grande. Use \n para quebrar a linha. */
  text?: string;
  /** Um logo no lugar do texto: o "d" de um caminho SVG (preenchido em evenodd, então furos funcionam). */
  logo?: string;
  /** O tamanho do quadro quadrado do logo (viewBox). */
  logoBox?: number;
  /** Linha pequena acima. */
  kicker?: string;
  /** Linha pequena embaixo (ex.: data, chamada). */
  footer?: string;
  /** Proporção do pano (largura / altura). */
  ratio?: number;
  className?: string;
  style?: CSSProperties;
}

const COLS = 30;
const ROWS = 20;

const VERT = `
attribute vec2 aPos; attribute vec2 aUv; attribute float aShade;
uniform vec2 uRes; varying vec2 vUv; varying float vShade;
void main(){ vUv = aUv; vShade = aShade; vec2 p = aPos / uRes * 2.0 - 1.0; gl_Position = vec4(p.x, -p.y, 0.0, 1.0); }`;
const FRAG = `
precision mediump float; uniform sampler2D uTex; uniform float uAlpha; uniform float uLight; varying vec2 vUv; varying float vShade;
void main(){
  vec4 c = texture2D(uTex, vUv); float d = vShade - 1.0;
  // Pano escuro: a luz clareia as dobras. Pano claro já está no branco, então são as sombras
  // que desenham as dobras (mais fundas), e o brilho vira só um toque.
  vec3 dark = c.rgb * vShade + vec3(max(d, 0.0)) * 0.6;
  vec3 light = c.rgb * (1.0 + min(d, 0.0) * 1.55) + vec3(max(d, 0.0)) * 0.08;
  gl_FragColor = vec4(mix(dark, light, uLight) * uAlpha, uAlpha);
}`;

export function ClothFlag({ text = "", logo, logoBox = 208, letter, logoW, logoH, logoWidth = 0.66, kicker, footer, ratio = 1.7, className = "", style }: ClothBannerProps) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = box.current!;
    const cv = canvas.current!;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, antialias: true, alpha: true });
    if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const N = COLS * ROWS;
    // A malha: posição atual, anterior (Verlet) e o comprimento de descanso entre vizinhos.
    const P = new Float32Array(N * 3);
    const O = new Float32Array(N * 3);
    const pos2 = new Float32Array(N * 2);
    const uv = new Float32Array(N * 2);
    const shade = new Float32Array(N);
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        uv[(y * COLS + x) * 2] = x / (COLS - 1);
        uv[(y * COLS + x) * 2 + 1] = y / (ROWS - 1);
      }
    const idx: number[] = [];
    for (let y = 0; y < ROWS - 1; y++)
      for (let x = 0; x < COLS - 1; x++) {
        const i = y * COLS + x;
        idx.push(i, i + 1, i + COLS, i + 1, i + COLS + 1, i + COLS);
      }
    const links: [number, number, number][] = [];
    const buf = (data: Float32Array, name: string, size: number) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return b;
    };
    const bPos = buf(pos2, "aPos", 2);
    buf(uv, "aUv", 2);
    const bShade = buf(shade, "aShade", 1);
    const ib = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uAlpha = gl.getUniformLocation(prog, "uAlpha");
    const uLight = gl.getUniformLocation(prog, "uLight");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const st = { w: 0, h: 0, cw: 0, ch: 0, left: 0, top: 0, step: 0, shown: 0, target: 0, visible: false, pinned: true, mx: -1, my: -1, mvx: 0, mvy: 0, grab: -1, gx: 0, gy: 0, ink: "" };

    // A estampa: o pano na cor do texto, as letras na cor do fundo, com a trama do tecido.
    const tex = gl.createTexture()!;
    const paint = (ink: string) => {
      const c = document.createElement("canvas");
      // A textura é 1024x512 (potência de dois, para ter mipmaps e a trama não virar faixas
      // quando o pano encolhe); desenha-se num quadro de 1024 x 1024/ratio esticado nela.
      c.width = 1024;
      c.height = 512;
      const x = c.getContext("2d")!;
      x.scale(1, 512 / Math.round(1024 / ratio));
      const H = Math.round(1024 / ratio);
      x.fillStyle = ink;
      x.fillRect(0, 0, c.width, H);
      // A trama: linhas finas nos dois sentidos.
      x.globalAlpha = 0.07;
      x.fillStyle = "#000";
      for (let i = 0; i < H; i += 3) x.fillRect(0, i, c.width, 1);
      for (let i = 0; i < c.width; i += 3) x.fillRect(i, 0, 1, H);
      x.globalAlpha = 1;
      // A bainha: uma costura perto da borda.
      x.setLineDash([10, 8]);
      x.strokeStyle = "rgb(127 127 127 / 0.55)";
      x.lineWidth = 3;
      x.strokeRect(26, 26, c.width - 52, H - 52);
      x.setLineDash([]);
      const bg = getComputedStyle(document.body).backgroundColor || "#000";
      x.fillStyle = letter ?? (bg === "rgba(0, 0, 0, 0)" ? "#000" : bg);
      x.textAlign = "center";
      x.textBaseline = "middle";
      if (logo && logoW && logoH) {
        // Logo largo, centrado, um pouco acima do meio para dar lugar às linhas pequenas.
        const w = c.width * logoWidth;
        const k = w / logoW;
        x.save();
        x.translate(c.width / 2 - w / 2, H / 2 - (logoH * k) / 2);
        x.scale(k, k);
        x.fill(new Path2D(logo), "evenodd");
        x.restore();
      } else if (logo) {
        // O logo estampado no meio, na cor do fundo, como as letras.
        const sz = H * 0.46;
        x.save();
        x.translate(c.width / 2 - sz / 2, H / 2 - sz / 2);
        x.scale(sz / logoBox, sz / logoBox);
        x.fill(new Path2D(logo), "evenodd");
        x.restore();
      } else {
        const lines = text.split("\n");
        let size = H / (lines.length + 1.6);
        x.font = `800 ${size}px Inter, ui-sans-serif, system-ui, sans-serif`;
        const widest = Math.max(...lines.map((l) => x.measureText(l).width));
        size = Math.min(size, (size * c.width * 0.8) / widest);
        x.font = `800 ${size}px Inter, ui-sans-serif, system-ui, sans-serif`;
        lines.forEach((l, i) => x.fillText(l, c.width / 2, H / 2 + (i - (lines.length - 1) / 2) * size * 1.02));
      }
      x.font = `600 ${Math.round(H * 0.05)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      if (kicker) x.fillText(kicker.toUpperCase().split("").join(" "), c.width / 2, H * 0.15);
      if (footer) x.fillText(footer.toUpperCase().split("").join(" "), c.width / 2, H * 0.86);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // Quão claro é o pano (0 escuro, 1 claro), para a luz das dobras.
      const m = ink.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
      gl.uniform1f(uLight, Math.min(1, Math.max(0, ((0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 - 0.35) / 0.3)));
    };

    /** Põe o pano enrolado junto do varão: ao soltar, ele cai e se desenrola. */
    const roll = () => {
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) {
          const i = (y * COLS + x) * 3;
          P[i] = O[i] = st.left + x * st.step;
          P[i + 1] = O[i + 1] = st.top + y * st.step * 0.06;
          P[i + 2] = O[i + 2] = -y * 1.5;
        }
      st.pinned = true;
    };

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      st.w = r.width;
      st.h = r.height;
      st.cw = Math.min(r.width * 0.8, (r.height - 70) * ratio);
      st.ch = st.cw / ratio;
      st.left = (r.width - st.cw) / 2;
      st.top = 46;
      st.step = st.cw / (COLS - 1);
      links.length = 0;
      const sx = st.step;
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x;
          const ry = st.ch / (ROWS - 1);
          if (x < COLS - 1) links.push([i, i + 1, sx]);
          if (y < ROWS - 1) links.push([i, i + COLS, ry]);
          if (x < COLS - 1 && y < ROWS - 1) links.push([i, i + COLS + 1, Math.hypot(sx, ry)]);
          if (x > 0 && y < ROWS - 1) links.push([i, i + COLS - 1, Math.hypot(sx, ry)]);
        }
      roll();
      gl.viewport(0, 0, cv.width, cv.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      st.visible = e.isIntersecting;
      st.target = e.intersectionRatio > 0.4 ? 1 : 0;
    }, { threshold: [0, 0.4, 0.8] });
    io.observe(el);

    const near = (x: number, y: number) => {
      let best = -1;
      let bd = 40 * 40;
      for (let i = 0; i < N; i++) {
        const dx = pos2[i * 2] - x;
        const dy = pos2[i * 2 + 1] - y;
        const d = dx * dx + dy * dy;
        if (d < bd) (bd = d), (best = i);
      }
      return best;
    };
    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const move = (e: PointerEvent) => {
      const [x, y] = local(e);
      if (st.mx >= 0) {
        st.mvx = st.mvx * 0.6 + (x - st.mx) * 0.4;
        st.mvy = st.mvy * 0.6 + (y - st.my) * 0.4;
      }
      st.mx = x;
      st.my = y;
      if (st.grab >= 0) (st.gx = x), (st.gy = y);
    };
    const down = (e: PointerEvent) => {
      const [x, y] = local(e);
      const i = near(x, y);
      if (i < 0) return;
      cv.setPointerCapture(e.pointerId);
      st.grab = i;
      st.gx = x;
      st.gy = y;
      el.style.cursor = "grabbing";
    };
    const up = () => {
      st.grab = -1;
      el.style.cursor = "grab";
    };
    const leave = () => ((st.mx = -1), (st.mvx = st.mvy = 0));
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", leave);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = performance.now();
    let tick = 0;
    const L = [-0.35, -0.55, 0.76];
    const step = (now: number) => {
      frame = requestAnimationFrame(step);
      if (!st.visible && st.shown === 0) return;
      const dt = Math.min(1 / 40, (now - last) / 1000);
      last = now;
      if (tick++ % 20 === 0) {
        // Repinta quando a cor do texto ou do fundo muda (o tema pode estar no meio da transição).
        const ink = getComputedStyle(el).color;
        const key = ink + getComputedStyle(document.body).backgroundColor;
        if (key !== st.ink) (st.ink = key), paint(ink);
      }
      const entering = st.target > st.shown;
      st.shown = Math.max(0, Math.min(1, st.shown + (entering ? dt / 0.5 : -dt / 1.2)));
      // Fora da tela: solta do varão e cai. De volta: enrola de novo e cai do varão.
      if (st.target === 0 && st.pinned && st.shown < 0.95) st.pinned = false;
      if (st.target === 1 && !st.pinned) roll();
      const t = now / 1000;
      const g = 1400 * dt * dt;
      // Vento: uma brisa que vai e volta, mais o vento que o cursor faz ao passar.
      const breeze = reduce ? 0 : (Math.sin(t * 0.9) * 0.6 + Math.sin(t * 2.3) * 0.25) * 17 * dt * dt;
      const gust = Math.hypot(st.mvx, st.mvy);
      st.mvx *= 0.9;
      st.mvy *= 0.9;
      for (let i = 0; i < N; i++) {
        const k = i * 3;
        const x = P[k], y = P[k + 1], z = P[k + 2];
        let vx = (x - O[k]) * 0.985;
        let vy = (y - O[k + 1]) * 0.985;
        let vz = (z - O[k + 2]) * 0.985;
        O[k] = x;
        O[k + 1] = y;
        O[k + 2] = z;
        vy += g;
        const row = Math.floor(i / COLS);
        vz += breeze * (0.5 + row / ROWS) * (1 + Math.sin(t * 1.7 + (i % COLS) * 0.35) * 0.4) * 60;
        if (st.mx >= 0 && gust > 0.5) {
          const dx = pos2[i * 2] - st.mx;
          const dy = pos2[i * 2 + 1] - st.my;
          const f = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 120);
          vz -= f * gust * 0.09;
          vx += f * st.mvx * 0.03;
        }
        P[k] = x + vx;
        P[k + 1] = y + vy;
        P[k + 2] = z + vz;
      }
      // As ligações, várias vezes para o pano não esticar.
      for (let it = 0; it < 5; it++) {
        for (const [a, b, rest] of links) {
          const ka = a * 3, kb = b * 3;
          const dx = P[kb] - P[ka], dy = P[kb + 1] - P[ka + 1], dz = P[kb + 2] - P[ka + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
          const diff = ((d - rest) / d) * 0.5;
          P[ka] += dx * diff; P[ka + 1] += dy * diff; P[ka + 2] += dz * diff;
          P[kb] -= dx * diff; P[kb + 1] -= dy * diff; P[kb + 2] -= dz * diff;
        }
        if (st.pinned)
          for (let x = 0; x < COLS; x++) {
            const k = x * 3;
            P[k] = st.left + x * st.step;
            P[k + 1] = st.top;
            P[k + 2] = 0;
          }
        if (st.grab >= 0) {
          const k = st.grab * 3;
          P[k] = st.gx;
          P[k + 1] = st.gy;
          P[k + 2] = 30;
        }
      }
      // Projeção com um pouco de perspectiva, e a luz em cada ponto pela normal da malha.
      const fov = 900;
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x;
          const k = i * 3;
          const s = fov / (fov - P[k + 2]);
          pos2[i * 2] = st.w / 2 + (P[k] - st.w / 2) * s;
          pos2[i * 2 + 1] = st.h * 0.3 + (P[k + 1] - st.h * 0.3) * s;
          const r = x < COLS - 1 ? k + 3 : k, l = x > 0 ? k - 3 : k;
          const d = y < ROWS - 1 ? k + COLS * 3 : k, u = y > 0 ? k - COLS * 3 : k;
          const ax = P[r] - P[l], ay = P[r + 1] - P[l + 1], az = P[r + 2] - P[l + 2];
          const bx = P[d] - P[u], by = P[d + 1] - P[u + 1], bz = P[d + 2] - P[u + 2];
          let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
          const nl = Math.hypot(nx, ny, nz) || 1;
          nx /= nl; ny /= nl; nz /= nl;
          if (nz < 0) (nx = -nx), (ny = -ny), (nz = -nz);
          shade[i] = 0.58 + 0.62 * Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
        }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, st.w, st.h);
      gl.uniform1f(uAlpha, Math.min(1, st.shown * 1.5 + (st.target === 1 ? 0.2 : 0)));
      gl.bindBuffer(gl.ARRAY_BUFFER, bPos);
      gl.bufferData(gl.ARRAY_BUFFER, pos2, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bShade);
      gl.bufferData(gl.ARRAY_BUFFER, shade, gl.DYNAMIC_DRAW);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
      cv.removeEventListener("pointerleave", leave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [text, logo, logoBox, kicker, footer, ratio, letter, logoW, logoH, logoWidth]);

  return (
    <div ref={box} className={className} role="img" aria-label={[kicker, text.replace(/\n/g, " ") || (logo ? "Avanti" : ""), footer].filter(Boolean).join(" · ")} style={{ position: "relative", width: "min(100%, 760px)", height: 470, cursor: "grab", touchAction: "none", ...style }}>
      <canvas ref={canvas} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {/* O varão e as duas cordas que o seguram. */}
      <svg aria-hidden="true" width="100%" height="60" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
        <line x1="10%" y1="46" x2="90%" y2="46" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <circle cx="10%" cy="46" r="7" fill="currentColor" />
        <circle cx="90%" cy="46" r="7" fill="currentColor" />
        <line x1="22%" y1="46" x2="50%" y2="2" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <line x1="78%" y1="46" x2="50%" y2="2" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <circle cx="50%" cy="2" r="2.5" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}
