import { useEffect, useRef, useState } from "react";
import { FlyingButton } from "@/components/myui/flying-button/flying-button";

/** "Seja AVANTI" que decola antes de abrir o pagamento (Flying Button do MyUI com as cores da marca).
 *  Ele decola, sobe como foguete até o topo da tela, o amarelo com a logo desce de lá e o pagamento abre (~3,7 s).
 *  Tocar de novo pula a espera. Sem JS, aparece um link comum. Com movimento reduzido, só a tela amarela rápida.
 *  Dentro de [data-checkout], o link sai do plano escolhido (data-sel + data-href-<plano>).
 */
interface Props {
  href: string;
  theme?: "light" | "dark";
  height?: number;
  label?: string;
}

const HANDOFF = 520; // o botão decola no palco e, aí, vira foguete
const ROCKET = 1050; // tempo até sair pelo topo da tela
const COVER = 1250; // o amarelo descendo do topo
const HOLD = 1000; // a logo parada antes de abrir o pagamento
const SMOKE = "208,201,182";

export default function CheckoutFly({ href, theme = "light", height = 210, label = "Seja" }: Props) {
  const [live, setLive] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const going = useRef(false);
  const timers = useRef<number[]>([]);
  const skip = useRef<(() => void) | null>(null);
  const [flight, setFlight] = useState(0); // muda a key para o botão voltar ao chão

  useEffect(() => {
    setLive(true);
    // Já abre a conexão com o pagamento, para a página carregar rápido depois do voo.
    if (!document.querySelector('link[href="https://pay.cakto.com.br"]')) {
      const l = document.createElement("link");
      l.rel = "preconnect";
      l.href = "https://pay.cakto.com.br";
      document.head.appendChild(l);
    }
    // Voltou do pagamento (botão "voltar"): tira a tela amarela e põe o botão no chão.
    const back = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      document.querySelectorAll(".fly-fx").forEach((n) => n.remove());
      if (skip.current) document.removeEventListener("pointerdown", skip.current, true);
      skip.current = null;
      going.current = false;
      setFlight((f) => f + 1);
    };
    window.addEventListener("pageshow", back);
    return () => window.removeEventListener("pageshow", back);
  }, []);

  const target = () => {
    const card = box.current?.closest<HTMLElement>("[data-checkout]");
    const sel = card?.dataset.sel;
    return (sel && card?.dataset[`href${sel[0].toUpperCase()}${sel.slice(1)}`]) || href;
  };

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  /** A tela amarela que cresce a partir de (x, y), com a logo e a frase. */
  const cover = (x: number, y: number, ms: number) => {
    const el = document.createElement("div");
    el.className = "fly-fx";
    el.setAttribute("role", "status");
    el.style.cssText = `position:fixed;inset:0;z-index:10000;display:grid;place-items:center;background:#fcc408;color:#10182a;clip-path:circle(0px at ${x}px ${y}px);transition:clip-path ${ms}ms cubic-bezier(.65,0,.25,1);`;
    el.innerHTML = `<div style="display:grid;justify-items:center;gap:18px;opacity:0;translate:0 16px;transition:opacity 520ms ease-out,translate 760ms cubic-bezier(.34,1.56,.64,1);"><img src="/logo-navy.png" alt="Avanti" width="480" height="84" style="width:min(62vw,300px);height:auto"><p style="margin:0;font-family:var(--font-display),sans-serif;font-weight:650;font-size:clamp(1.25rem,1rem + 1vw,1.7rem);letter-spacing:-0.02em">Seja bem-vindo ao time.</p></div>`;
    document.body.appendChild(el);
    const inner = el.firstElementChild as HTMLElement;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.clipPath = `circle(160vmax at ${x}px ${y}px)`;
        later(() => { inner.style.opacity = "1"; inner.style.translate = "0 0"; }, ms * 0.45);
      })
    );
  };

  /** O botão sai do cartão e sobe como foguete até passar do topo da tela, deixando fumaça. */
  const rocket = (onTop: (x: number) => void) => {
    const btn = box.current?.querySelector("button");
    const faceEl = box.current?.querySelector("[data-face]");
    if (!btn || !faceEl) return onTop(innerWidth / 2);
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const dist = r.bottom + 60; // até sumir pelo topo

    const ship = document.createElement("div");
    ship.className = "fly-fx";
    ship.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:9999;display:flex;align-items:center;justify-content:center;border-radius:999px;background:#fcc408;color:#10182a;box-shadow:inset 0 1px 0 rgb(255 255 255/.45),0 10px 30px -10px rgb(120 86 0/.6);will-change:transform;pointer-events:none;`;
    ship.appendChild(faceEl.cloneNode(true));
    // Dois jatos embaixo: chama amarela e branca que tremula.
    for (const at of [0.22, 0.78]) {
      const jet = document.createElement("span");
      jet.style.cssText = `position:absolute;left:${at * 100}%;top:100%;width:14px;height:46px;margin-left:-7px;border-radius:0 0 50% 50%/0 0 80% 80%;background:linear-gradient(#fff,#ffe27a 35%,rgba(252,196,8,0));transform-origin:top;filter:blur(.6px);`;
      jet.animate([{ transform: "scaleY(.7)" }, { transform: "scaleY(1.25)" }, { transform: "scaleY(.85)" }], { duration: 120, iterations: Infinity });
      ship.appendChild(jet);
    }
    document.body.appendChild(ship);
    btn.style.visibility = "hidden";

    // Rastro de fumaça: uma coluna que cresce junto com a subida.
    const trail = document.createElement("div");
    trail.className = "fly-fx";
    trail.style.cssText = `position:fixed;left:${x - r.width * 0.22}px;top:0;width:${r.width * 0.44}px;height:${r.bottom}px;z-index:9998;transform-origin:bottom;transform:scaleY(0);border-radius:999px;background:linear-gradient(to top,rgba(${SMOKE},0),rgba(${SMOKE},.85) 30%,rgba(${SMOKE},.6));filter:blur(10px);pointer-events:none;`;
    document.body.appendChild(trail);

    const ease = "cubic-bezier(.55,0,.85,.35)"; // começa devagar e dispara
    ship.animate(
      [
        { transform: "translate(0,0) rotate(0deg)" },
        { transform: `translate(-2px,${-dist * 0.08}px) rotate(-1.5deg)`, offset: 0.25 },
        { transform: `translate(2px,${-dist * 0.4}px) rotate(1deg)`, offset: 0.65 },
        { transform: `translate(0,${-dist}px) rotate(0deg) scaleY(1.06)` },
      ],
      { duration: ROCKET, easing: ease, fill: "forwards" }
    );
    trail.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: ROCKET, easing: ease, fill: "forwards" });

    // Nuvens de fumaça que ficam para trás e se espalham.
    const puff = () => {
      const s = ship.getBoundingClientRect();
      if (s.bottom < -20) return;
      const size = 26 + Math.random() * 30;
      const p = document.createElement("span");
      p.className = "fly-fx";
      p.style.cssText = `position:fixed;left:${s.left + s.width / 2 - size / 2 + (Math.random() - 0.5) * 30}px;top:${s.bottom - size / 3}px;width:${size}px;height:${size}px;border-radius:50%;z-index:9998;background:rgba(${SMOKE},.9);filter:blur(4px);pointer-events:none;`;
      document.body.appendChild(p);
      p.animate(
        [{ transform: "scale(.4)", opacity: 0.9 }, { transform: `translate(${(Math.random() - 0.5) * 80}px,${20 + Math.random() * 30}px) scale(2.2)`, opacity: 0 }],
        { duration: 1100, easing: "ease-out", fill: "forwards" }
      );
      later(puff, 45);
    };
    puff();

    later(() => onTop(x), ROCKET - 80);
  };

  const go = () => {
    const url = target();
    const leave = () => window.location.assign(url);
    if (going.current) return leave(); // segundo toque pula a animação
    going.current = true;
    // Qualquer toque depois da decolagem pula a espera.
    later(() => {
      skip.current = leave;
      document.addEventListener("pointerdown", leave, { capture: true, once: true });
    }, 0);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cover(innerWidth / 2, innerHeight / 2, 200);
      later(leave, 450);
      return;
    }
    // Decola no cartão, sobe como foguete até o topo, o amarelo desce de lá e o pagamento abre (~3,7 s).
    later(() =>
      rocket((x) => {
        cover(x, 0, COVER);
        later(leave, COVER + HOLD);
      }), HANDOFF);
  };

  // Igual ao botão "Seja AVANTI" do site: pílula amarela, logo e a seta na bolinha escura.
  const face = (
    <span data-face className="inline-flex items-center gap-[12px] font-semibold" style={{ fontSize: 15.5, letterSpacing: "-0.01em" }}>
      <span className="inline-flex items-center gap-[0.36em]">
        {label}
        <img src="/logo-navy.png" alt="Avanti" width={480} height={84} style={{ height: "0.8em", width: "auto" }} />
      </span>
      <span
        aria-hidden="true"
        className="grid place-items-center rounded-full"
        style={{ width: 36, height: 36, marginRight: -19, background: "#10182a", color: "#fcc408" }}
      >
        <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9.5M8.5 4 12.5 8l-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </span>
  );

  return (
    <div ref={box} className="checkout-fly" style={{ height }}>
      {live ? (
        <FlyingButton
          key={flight}
          onClick={go}
          theme={theme}
          size="large"
          trigger="click"
          carryCursor={false}
          altitude={130}
          hoverTime={1.2}
          jets={2}
          smoke={1.15}
          buttonColor="#fcc408"
          textColor="#10182a"
          thrustColor="#ffd84a"
          smokeColor={theme === "dark" ? "#dfe6f5" : "#e9e1c8"}
          rampColor={theme === "dark" ? "#1b2a4d" : "#f3ead0"}
          style={{ minHeight: 0, height: "100%" }}
        >
          {face}
        </FlyingButton>
      ) : (
        <a href={href} className="btn btn-yellow has-arrow">{face}</a>
      )}
    </div>
  );
}
