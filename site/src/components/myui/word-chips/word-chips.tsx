"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { siClaude, siCursor, siGooglegemini, siPerplexity } from "simple-icons";

/*
 * Word Chips: uma frase com palavras trocáveis dentro de chips com ícone.
 * Clique num chip e a palavra seguinte entra letra a letra, saindo do cinza, enquanto a antiga
 * some num fantasma; o chip estica ou encolhe até a palavra nova e o ícone estoura e assenta.
 * Parada, a frase troca sozinha, um chip de cada vez.
 */

export type ChipWord = { word: string; icon: ReactNode };

/* Ícones dos conceitos, desenhados aqui (24×24). */
const I = {
  languages: (
    <svg viewBox="0 0 24 24">
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h8A2.5 2.5 0 0 1 16 5.5v4a2.5 2.5 0 0 1-2.5 2.5H8l-3.2 2.4V12A2.5 2.5 0 0 1 3 9.5z" fill="#ffc531" />
      <path d="M5.4 6.3h7.4M5.4 8.8h4.4" stroke="#b07a00" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 11.5A2.5 2.5 0 0 1 11.5 9h8a2.5 2.5 0 0 1 2.5 2.5v4.2a2.5 2.5 0 0 1-2.5 2.5h-.7V21l-3.4-2.8h-3.9A2.5 2.5 0 0 1 9 15.7z" fill="#2f86ff" />
      <circle cx="13.6" cy="13.6" r="1.1" fill="#fff" />
      <circle cx="17.4" cy="13.6" r="1.1" fill="#fff" />
    </svg>
  ),
  themes: (
    <svg viewBox="0 0 24 24">
      <path d="M1.5 9h4M2.5 12h3M1.5 15h4" stroke="#2f86ff" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
      <rect x="7" y="3.5" width="15" height="17" rx="4" transform="rotate(-9 14.5 12)" fill="#1b2130" />
      <circle cx="14.6" cy="10" r="3.1" fill="#3d8bff" />
      <rect x="11" y="15" width="3.6" height="2.4" rx="1.2" transform="rotate(-9 14.5 12)" fill="#fff" />
      <rect x="15.6" y="14.3" width="3.6" height="2.4" rx="1.2" transform="rotate(-9 14.5 12)" fill="#9cc2ff" />
    </svg>
  ),
  motion: (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#efe9ff" />
      <path d="M5.5 18.5C7 9 11 6 18.5 5.5" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
      <path d="M5.5 18.5 8 11.5M18.5 5.5 12 6.4" stroke="#c4b5fd" strokeWidth="1.1" />
      <circle cx="8" cy="11.5" r="1.4" fill="#8b5cf6" />
      <circle cx="12" cy="6.4" r="1.4" fill="#8b5cf6" />
    </svg>
  ),
  components: (
    <svg viewBox="0 0 24 24">
      <rect x="1.5" y="6" width="21" height="12" rx="6" fill="#26d466" />
      <circle cx="16.4" cy="12" r="4.4" fill="#fff" />
      <circle cx="16.4" cy="12" r="2.6" fill="none" stroke="#26d466" strokeWidth="1.4" />
    </svg>
  ),
  colors: (
    <svg viewBox="0 0 24 24">
      <rect x="9.5" y="2.5" width="7" height="17" rx="2.5" transform="rotate(32 13 11)" fill="#3b82f6" />
      <rect x="8.5" y="3" width="7" height="17" rx="2.5" transform="rotate(14 12 11.5)" fill="#a855f7" />
      <rect x="6" y="3.5" width="7" height="17" rx="2.5" transform="rotate(-6 9.5 12)" fill="#ff4d6d" />
      <rect x="3.5" y="4" width="7" height="17" rx="2.5" transform="rotate(-22 7 12.5)" fill="#ffb020" />
      <circle cx="6.6" cy="17.4" r="1.4" fill="#fff" />
    </svg>
  ),
  type: (
    <svg viewBox="0 0 24 24">
      <text x="12" y="17.2" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="ui-sans-serif,system-ui" fill="#1fc95b">
        Aa
      </text>
    </svg>
  ),
  spacing: (
    <svg viewBox="0 0 24 24">
      <rect x="1" y="8" width="22" height="8" rx="2" transform="rotate(-38 12 12)" fill="#ffd23f" />
      <path d="M7.4 14.3l1.3 1.7M10 12.2l1.9 2.4M12.6 10.1l1.3 1.7M15.2 8l1.9 2.4" stroke="#a37b00" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  icons: (
    <svg viewBox="0 0 24 24">
      <path d="M8.6 19.5S2 15.4 2 10.4A4 4 0 0 1 8.6 7.6a4 4 0 0 1 6.6 2.8c0 5-6.6 9.1-6.6 9.1z" fill="#ff3d7f" />
      <path d="M17.6 3 13.4 12h3.4l-1.6 8.6 5.6-10.4h-3.6l2.4-7.2z" fill="#38bdf8" stroke="#fff" strokeWidth=".8" strokeLinejoin="round" />
    </svg>
  ),
  states: (
    <svg viewBox="0 0 24 24">
      <path d="M12 1.8l2.6 1.9 3.2-.1 1 3.1 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3.1-3.2-.1L12 22.2l-2.6-1.9-3.2.1-1-3.1-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3.1 3.2.1z" fill="#8b5cf6" />
      <path d="m8.2 12.2 2.6 2.6 5-5.3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  effects: (
    <svg viewBox="0 0 24 24">
      <defs>
        <filter id="wc-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      <circle cx="10" cy="13" r="7" fill="#ff8a3d" filter="url(#wc-soft)" />
      <circle cx="14" cy="10" r="5.5" fill="#ff4fa3" filter="url(#wc-soft)" opacity=".85" />
      <path d="M18.5 2.5l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" fill="#ffc531" />
    </svg>
  ),
};

/** Marca de IA (simple-icons) em volume: gradiente da cor da marca, brilho por cima e sombra. */
const brand = (icon: { path: string; hex: string }, ink?: string) => {
  const id = `wc-b-${icon.hex}`;
  return (
    <svg viewBox="0 0 24 24">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: ink ?? `#${icon.hex}`, stopOpacity: 0.72 }} />
          <stop offset=".55" style={{ stopColor: ink ?? `#${icon.hex}` }} />
        </linearGradient>
      </defs>
      <path d={icon.path} fill={`url(#${id})`} />
    </svg>
  );
};

export const WORD_CHIPS_DEFAULT: { before: string; slot: ChipWord[] }[] = [
  {
    before: "Uma ferramenta para criar",
    slot: [
      { word: "linguagens", icon: I.languages },
      { word: "temas", icon: I.themes },
    ],
  },
  {
    before: "visuais, personalizar",
    slot: [
      { word: "movimento", icon: I.motion },
      { word: "componentes", icon: I.components },
      { word: "cores", icon: I.colors },
      { word: "tipografia", icon: I.type },
      { word: "espaçamento", icon: I.spacing },
      { word: "ícones", icon: I.icons },
      { word: "estados", icon: I.states },
      { word: "efeitos", icon: I.effects },
    ],
  },
  {
    before: "e montar interfaces com",
    slot: [
      { word: "Gemini", icon: brand(siGooglegemini) },
      { word: "Claude", icon: brand(siClaude) },
      { word: "Cursor", icon: brand(siCursor, "light-dark(#111,#f2f2f2)") },
      { word: "Perplexity", icon: brand(siPerplexity) },
    ],
  },
];

function Chip({ words, index, onNext }: { words: ChipWord[]; index: number; onNext: () => void }) {
  const cur = words[index % words.length];
  const [ghost, setGhost] = useState<{ word: string; key: number } | null>(null);
  const prev = useRef(index);
  const text = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  // A largura vai da palavra antiga até a nova, medida antes de pintar.
  useLayoutEffect(() => {
    const el = text.current;
    if (el) setWidth(el.scrollWidth);
    if (prev.current !== index) {
      setGhost({ word: words[prev.current % words.length].word, key: Date.now() });
      prev.current = index;
    }
  }, [index, words]);

  return (
    <button type="button" className="wc-chip" onClick={onNext} aria-label={`${cur.word}: trocar`}>
      <span className="wc-icon" key={`i${index}`} aria-hidden="true">
        {cur.icon}
      </span>
      <span className="wc-word" style={{ width: width ?? undefined }}>
        <span ref={text} className="wc-letters" key={`w${index}`}>
          {[...cur.word].map((ch, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
        {ghost ? (
          <span className="wc-ghost" key={ghost.key} aria-hidden="true" onAnimationEnd={() => setGhost(null)}>
            {ghost.word}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export interface WordChipsProps {
  /** O nome no selo de cima. */
  title?: string;
  /** Os trechos da frase: o texto antes e as palavras que o chip alterna. */
  parts?: { before: string; slot: ChipWord[] }[];
  /** O fim da frase. */
  after?: string;
  /** Intervalo da troca automática, em ms (0 desliga). */
  interval?: number;
  className?: string;
}

export function WordChips({ title = "MyUI", parts = WORD_CHIPS_DEFAULT, after = ".", interval = 1700, className = "" }: WordChipsProps) {
  const [idx, setIdx] = useState(() => parts.map(() => 0));
  const touched = useRef(0);
  const turn = useRef(parts.length - 1);

  const next = (p: number) => setIdx((s) => s.map((v, i) => (i === p ? (v + 1) % parts[p].slot.length : v)));

  // Sozinha: um chip por vez, de trás para a frente, como alguém passando o mouse.
  useEffect(() => {
    if (!interval) return;
    const id = setInterval(() => {
      if (Date.now() - touched.current < 5000) return;
      next(turn.current);
      turn.current = (turn.current + parts.length - 1) % parts.length;
    }, interval);
    return () => clearInterval(id);
  }, [interval, parts.length]);

  return (
    <div className={`wc-root ${className}`.trim()}>
      <style>{CSS}</style>
      <span className="wc-title">{title}</span>
      <div className="wc-text">
        {parts.map((part, p) => (
          <span key={p}>
            {part.before}{" "}
            <Chip
              words={part.slot}
              index={idx[p]}
              onNext={() => {
                touched.current = Date.now();
                next(p);
              }}
            />
            {p === 0 ? " " : p < parts.length - 1 ? " " : ""}
          </span>
        ))}
        {after}
      </div>
    </div>
  );
}

const CSS = `
.wc-root{display:grid;justify-items:center;gap:30px;max-width:520px;color:light-dark(#0b0b0c,#f4f4f5);font-family:inherit;text-align:center}
.wc-title{padding:5px 15px 6px;border:3px solid currentColor;border-radius:999px;font-size:22px;font-weight:700;letter-spacing:-.03em;line-height:1.1}
.wc-text{margin:0;font-size:21px;font-weight:480;line-height:1.62;letter-spacing:-.015em;text-wrap:balance}
.wc-chip{display:inline-flex;align-items:center;gap:5px;height:31px;margin:0 1px;padding:0 9px 0 6px;vertical-align:middle;position:relative;top:-4px;border:0;border-radius:10px;background:light-dark(#efefee,#232326);color:inherit;font:inherit;line-height:1;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .2s ease,scale .3s cubic-bezier(.34,1.56,.64,1)}
.wc-chip:hover{background:light-dark(#e6e6e4,#2c2c30)}
.wc-chip:active{scale:.96}
.wc-chip:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.wc-icon{display:grid;place-items:center;width:24px;height:24px;flex:none;filter:drop-shadow(0 1.5px 1.5px rgb(0 0 0/.18));animation:wc-pop .6s cubic-bezier(.34,1.7,.5,1) both}
.wc-icon svg{width:100%;height:100%;overflow:visible}
.wc-word{position:relative;display:inline-block;height:1.2em;line-height:1.2;text-align:left;white-space:nowrap;transition:width .42s cubic-bezier(.22,1,.36,1)}
.wc-letters{display:inline-block}
.wc-letters>span{display:inline-block;white-space:pre;animation:wc-letter .5s cubic-bezier(.22,1,.36,1) calc(var(--i)*34ms) both}
.wc-ghost{position:absolute;left:0;top:0;pointer-events:none;animation:wc-ghost .32s ease-out forwards}
@keyframes wc-letter{from{opacity:.12;filter:blur(3px);translate:0 1px}}
@keyframes wc-ghost{to{opacity:0;filter:blur(4px)}}
@keyframes wc-pop{0%{scale:.2;rotate:-25deg;opacity:0}55%{scale:1.4;rotate:6deg;opacity:1}100%{scale:1;rotate:0deg}}
@media (prefers-reduced-motion:reduce){.wc-icon,.wc-letters>span,.wc-ghost{animation:none}.wc-word{transition:none}}
`;
